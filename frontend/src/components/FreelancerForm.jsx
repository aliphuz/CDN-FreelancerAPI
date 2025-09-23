import { useState, useEffect } from 'react';
import styles from '../styles/FreelancerForm.module.css';

const FreelancerForm = ({ freelancer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    skillsets: [],
    hobbies: []
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [hobbyInput, setHobbyInput] = useState('');

  useEffect(() => {
    if (freelancer) {
      setFormData({
        username: freelancer.username || '',
        email: freelancer.email || '',
        phone: freelancer.phone || '',
        skillsets: freelancer.skillsets?.map(s => s.skillName || s) || [],
        hobbies: freelancer.hobbies?.map(h => h.hobbyName || h) || []
      });
    }
  }, [freelancer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const freelancerData = {
      ...formData,
      id: freelancer?.id || Date.now()
    };
    onSave(freelancerData);
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsets.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsets: [...prev.skillsets, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillsets: prev.skillsets.filter(s => s !== skill)
    }));
  };

  const addHobby = () => {
    if (hobbyInput.trim() && !formData.hobbies.includes(hobbyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobbyInput.trim()]
      }));
      setHobbyInput('');
    }
  };

  const removeHobby = (hobby) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobby)
    }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>
        {freelancer ? 'Edit Freelancer' : 'Add New Freelancer'}
      </h2>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Skills:</label>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add skill"
            className={styles.input}
            style={{ marginRight: '10px' }}
          />
          <button type="button" onClick={addSkill} className={styles.saveButton}>
            Add
          </button>
        </div>
        <div>
          {formData.skillsets.map((skill, index) => (
            <span key={index} style={{ 
              display: 'inline-block', 
              background: '#ff6b35', 
              color: 'white',
              padding: '5px 10px', 
              margin: '2px', 
              borderRadius: '15px',
              fontSize: '12px'
            }}>
              {skill}
              <button 
                type="button" 
                onClick={() => removeSkill(skill)}
                style={{ marginLeft: '5px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Hobbies:</label>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <input
            type="text"
            value={hobbyInput}
            onChange={(e) => setHobbyInput(e.target.value)}
            placeholder="Add hobby"
            className={styles.input}
            style={{ marginRight: '10px' }}
          />
          <button type="button" onClick={addHobby} className={styles.saveButton}>
            Add
          </button>
        </div>
        <div>
          {formData.hobbies.map((hobby, index) => (
            <span key={index} style={{ 
              display: 'inline-block', 
              background: '#666', 
              color: 'white',
              padding: '5px 10px', 
              margin: '2px', 
              borderRadius: '15px',
              fontSize: '12px'
            }}>
              {hobby}
              <button 
                type="button" 
                onClick={() => removeHobby(hobby)}
                style={{ marginLeft: '5px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButton}>
          {freelancer ? 'Update' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default FreelancerForm;