import { useState, useEffect } from 'react';
import { freelancerApi } from './services/api';
import FreelancerTable from './components/FreelancerTable';
import FreelancerForm from './components/FreelancerForm';
import styles from './styles/App.module.css';

function App() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFreelancers();
  }, []);

  const loadFreelancers = async () => {
    try {
      const response = await freelancerApi.getAll();
      setFreelancers(response.data);
    } catch (error) {
      console.error('Error loading freelancers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const [currentView, setCurrentView] = useState('list');
  const [editingFreelancer, setEditingFreelancer] = useState(null);

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
            Add New Freelancer
          </button>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#ff6b35', fontSize: '18px' }}>Loading...</div>
          ) : (
            <FreelancerTable 
              freelancers={freelancers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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