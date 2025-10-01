import { useState, useEffect } from 'react';
import { freelancerApi } from '../services/api';

const FreelancerList = ({ onEdit, onView }) => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadFreelancers(page);
  }, [page]);

  const loadFreelancers = async (pageNumber = 1) => {
    try {
      const response = await freelancerApi.getAll(pageNumber, pageSize);
      setFreelancers(response.data);
    } catch (error) {
      console.error('Error loading freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      loadFreelancers(page);
      return;
    }
    try {
      const response = await freelancerApi.search(search);
      setFreelancers(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Search bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Search</button>
        <button onClick={() => { setSearch(''); loadFreelancers(page); }} style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Username</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Phone</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {freelancers.map((freelancer) => (
            <tr key={freelancer.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{freelancer.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{freelancer.username}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{freelancer.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{freelancer.phone}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {freelancer.isArchived ? 'Archived' : 'Active'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ padding: '8px 16px', marginRight: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Previous
        </button>
        <span> Page {page} </span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={freelancers.length < pageSize} 
          style={{ padding: '8px 16px', marginLeft: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FreelancerList;
