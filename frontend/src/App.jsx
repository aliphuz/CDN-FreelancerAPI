import { useState, useEffect } from 'react';
import { freelancerApi } from './services/api';
import FreelancerTable from './components/FreelancerTable';
import FreelancerForm from './components/FreelancerForm';
import styles from './styles/App.module.css';

function App() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [currentView, setCurrentView] = useState('list');
  const [editingFreelancer, setEditingFreelancer] = useState(null);

  useEffect(() => {
    loadFreelancers();
  }, [page]);

  const loadFreelancers = async () => {
    setLoading(true);
    try {
      const response = await freelancerApi.getAll(page, pageSize);
      setFreelancers(response.data);
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

  const handleCancel = () => {
    setCurrentView('list');
    setEditingFreelancer(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Freelancer Management</h1>
      
      {currentView === 'list' && (
        <>
          <button onClick={handleAddNew} className={styles.addButton}>
            ➕ Add New Freelancer
          </button>

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
              />

              {/* Pagination Controls */}
              <div className={styles.pagination}>
                <button 
                  onClick={() => setPage((p) => Math.max(p - 1, 1))} 
                  disabled={page === 1}
                  className={styles.pageButton}
                >
                  ⬅ Previous
                </button>

                <span className={styles.pageInfo}>Page {page}</span>

                <button 
                  onClick={() => setPage((p) => p + 1)} 
                  disabled={freelancers.length < pageSize}
                  className={styles.pageButton}
                >
                  Next ➡
                </button>
              </div>
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

export default App;
