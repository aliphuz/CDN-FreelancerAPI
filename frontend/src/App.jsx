import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { freelancerApi } from './services/api';
import FreelancerTable from './components/FreelancerTable';
import FreelancerForm from './components/FreelancerForm';
import Login from './pages/Login';
import Register from './pages/Register';
import styles from './styles/App.module.css';

function Dashboard() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [currentView, setCurrentView] = useState('list');
  const [editingFreelancer, setEditingFreelancer] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 10;

  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    loadFreelancers();
  }, [page, searchKeyword]);

  const loadFreelancers = async () => {
    setLoading(true);
    try {
      const response = await freelancerApi.getAll(page, pageSize, searchKeyword);
      setFreelancers(response.data);

      if (searchKeyword.trim()) {
        setIsSearching(true);
        setPage(1);
      } else {
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Error loading freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingFreelancer(null);
    setCurrentView('form');
  };

  const handleEdit = (freelancer) => {
    setEditingFreelancer(freelancer);
    setCurrentView('form');
  };

  const handleSave = async (freelancerData) => {
    try {
      if (editingFreelancer) {
        await freelancerApi.update(editingFreelancer.id, freelancerData);
      } else {
        await freelancerApi.create(freelancerData);
      }
      await loadFreelancers();
      setCurrentView('list');
      setEditingFreelancer(null);
    } catch (error) {
      console.error('Error saving freelancer:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await freelancerApi.delete(id);
      await loadFreelancers();
    } catch (error) {
      console.error('Error deleting freelancer:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingFreelancer(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <h1 className={styles.title}>Freelancer Management</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Role: {role}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {currentView === 'list' && (
        <>
          <div className={styles.actionBar}>
            {role === 'Admin' && (
              <button onClick={handleAddNew} className={styles.addButton}>
                ➕ Add New Freelancer
              </button>
            )}

            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search freelancers..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className={styles.searchInput}
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className={styles.clearButton}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: '#ff6b35', fontSize: '18px' }}>Loading...</div>
          ) : (
            <>
              <FreelancerTable
                freelancers={freelancers}
                onEdit={role === 'Admin' ? handleEdit : undefined}
                onDelete={role === 'Admin' ? handleDelete : undefined}
              />

              {!isSearching && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={styles.pageButton}
                  >
                    ← Previous
                  </button>
                  <span className={styles.pageInfo}>Page {page}</span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={freelancers.length < pageSize}
                    className={styles.pageButton}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {currentView === 'form' && (
        <FreelancerForm
          freelancer={editingFreelancer}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            role ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={setRole} />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            role ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
