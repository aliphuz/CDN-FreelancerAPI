import { useState, useEffect } from 'react';
import { freelancerApi } from '../services/api';

const FreelancerDetail = ({ freelancerId, onBack }) => {
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFreelancer();
  }, [freelancerId]);

  const loadFreelancer = async () => {
    try {
      const response = await freelancerApi.getById(freelancerId);
      setFreelancer(response.data);
    } catch (error) {
      console.error('Error loading freelancer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!freelancer) return <div>Freelancer not found</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>← Back to List</button>
      
      <h2>Freelancer Details</h2>
      
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px', borderRadius: '12px', color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '15px' }}>
          <strong>ID:</strong> {freelancer.id}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Username:</strong> {freelancer.username}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Email:</strong> {freelancer.email}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Phone:</strong> {freelancer.phone}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Status:</strong> {freelancer.isArchived ? 'Archived' : 'Active'}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Skills:</strong>
          <div style={{ marginTop: '5px' }}>
            {freelancer.skillsets?.length > 0 ? (
              freelancer.skillsets.map((skill, index) => (
                <span key={index} style={{ 
                  display: 'inline-block', 
                  background: '#007bff', 
                  color: 'white',
                  padding: '5px 10px', 
                  margin: '2px', 
                  borderRadius: '15px',
                  fontSize: '12px'
                }}>
                  {skill.skillName}
                </span>
              ))
            ) : (
              <span style={{ color: '#666' }}>No skills listed</span>
            )}
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Hobbies:</strong>
          <div style={{ marginTop: '5px' }}>
            {freelancer.hobbies?.length > 0 ? (
              freelancer.hobbies.map((hobby, index) => (
                <span key={index} style={{ 
                  display: 'inline-block', 
                  background: '#28a745', 
                  color: 'white',
                  padding: '5px 10px', 
                  margin: '2px', 
                  borderRadius: '15px',
                  fontSize: '12px'
                }}>
                  {hobby.hobbyName}
                </span>
              ))
            ) : (
              <span style={{ color: '#666' }}>No hobbies listed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetail;