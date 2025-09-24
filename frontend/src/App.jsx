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
  
  // Search state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchKeyword.trim()) {
      handleSearch();
    } else {
      loadFreelancers();
    }
  }, [page, searchKeyword]);

  const loadFreelancers = async () => {
    setLoading(true);
    setIsSearching(false);
    try {
      const response = await freelancerApi.getAll(page, pageSize);
      setFreelancers(response.data);
    } catch (error) {
      console.error('Error loading freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadFreelancers();
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const response = await freelancerApi.search(searchKeyword);
      setFreelancers(response.data);
      setPage(1); // Reset to first page when searching
    } catch (error) {
      console.error('Error searching freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    
    // If search is cleared, reload all freelancers
    if (!value.trim()) {
      setIsSearching(false);
      setPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setIsSearching(false);
    setPage(1);
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
      if (searchKeyword.trim()) {
        await handleSearch();
      } else {
        await loadFreelancers();
      }
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
          <div className={styles.actionBar}>
            <button onClick={handleAddNew} className={styles.addButton}>
              ➕ Add New Freelancer
            </button>

            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search freelancers..."
                value={searchKeyword}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              {searchKeyword && (
                <button 
                  onClick={handleClearSearch}
                  className={styles.clearButton}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {isSearching && searchKeyword && (
            <div className={styles.searchIndicator}>
              Showing results for: "<strong>{searchKeyword}</strong>"
            </div>
          )}

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

              {/* Show pagination only when not searching */}
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

              {/* Show message when no results found */}
              {freelancers.length === 0 && !loading && (
                <div className={styles.noResults}>
                  {isSearching ? 
                    `No freelancers found matching "${searchKeyword}"` : 
                    'No freelancers found'
                  }
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

export default App;