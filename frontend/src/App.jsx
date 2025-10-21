import { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import FreelancerTable from './components/FreelancerTable';
import FreelancerForm from './components/FreelancerForm';
import Login from './pages/Login';
import Register from './pages/Register';
import styles from './styles/App.module.css';
import { freelancerApi } from './services/api';
import HobbyManagement from './components/HobbyManagement';
import SkillManagement from './components/SkillManagement';



function Dashboard({ setRole }) {
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
  const userId = localStorage.getItem('userId');
  const [hasFreelancer, setHasFreelancer] = useState(false);


  const loadFreelancers = async () => {
    setLoading(true);
     try {
    const response = await freelancerApi.getAll(page, pageSize, searchKeyword);
    setFreelancers(response.data);

   
    const userHasFreelancer = response.data.some(f => f.userId === Number(userId));
    setHasFreelancer(userHasFreelancer);

    setIsSearching(!!searchKeyword.trim());
    if (searchKeyword.trim()) setPage(1);
  } catch (error) {
    console.error('Error loading freelancers:', error);
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    loadFreelancers();
  }, [page, searchKeyword]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setRole(null);
    navigate('/login');
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
    if (!window.confirm('Are you sure you want to delete this freelancer?')) return;
    try {
      await freelancerApi.delete(id);
      await loadFreelancers();
    } catch (error) {
      console.error('Error deleting freelancer:', error);
      alert('Failed to delete freelancer.');
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingFreelancer(null);
  };

  const handleArchive = async (id, isArchived) => {
    try {
      await freelancerApi.archive(id, isArchived);
      await loadFreelancers();
    } catch (error) {
      console.error('Error archiving:', error);
      alert('You can only archive your Freelancer Account.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <h1 className={styles.title}>Freelancer Management</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Role: {role}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </div>
      </div>

      {currentView === 'list' && (
        <>
          <div className={styles.actionBar}>
            {role === 'User' && !hasFreelancer && (
              <button onClick={handleAddNew} className={styles.addButton}>
                ➕ Create New Freelancer
              </button>
            )}
           {role === 'Admin' && (
              <div style={{ display: "flex", gap: "10px" }}>
               <button onClick={handleAddNew} className={styles.addButton}>
                 ➕ Add New Freelancer
              </button>
               <button
               onClick={() => navigate('/hobbies')}
              className={styles.addButton}
              style={{ backgroundColor: '#28a745' }}
            >
            🧩 Manage Hobbies
              </button>
              <button
               onClick={() => navigate('/skills')}
              className={styles.addButton}
              style={{ backgroundColor: '#17a2b8' }}
            >
            🎨 Manage Skills
              </button>
              </div>
                
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
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: '#ff6b35', fontSize: '18px' }}>
              Loading...
            </div>
          ) : (
            <>
              <FreelancerTable
                freelancers={freelancers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onArchive={handleArchive}
                userId={userId}
                role={role}
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


// -------------------- App Root --------------------
function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={setRole} />} />
        <Route path="/register" element={<Register />} />

        
        <Route
          path="/"
          element={
            localStorage.getItem('token') ? (
              <Dashboard setRole={setRole} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
          />
           <Route
          path="/hobbies"
          element={
            localStorage.getItem('token') && localStorage.getItem('role') === 'Admin' ? (
              <HobbyManagement />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
        path = "/skills"
        element={
          localStorage.getItem('token') && localStorage.getItem('role') === 'Admin' ? (
            <SkillManagement />
          ) : (
            <Navigate to = "/" replace />
          )
        }
        />
      </Routes>
    </Router>
  );
}

export default App;
