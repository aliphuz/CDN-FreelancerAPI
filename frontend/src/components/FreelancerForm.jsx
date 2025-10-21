import { useState, useEffect } from 'react';
import styles from '../styles/FreelancerForm.module.css';
import { freelancerApi } from '../services/api';
import { hobbyApi}   from '../services/api';
import { skillsetApi } from '../services/api';

const FreelancerForm = ({ freelancer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    skillsetIds: [],
    hobbyIds: []
  });

  const [options, setOptions] = useState({ skillsets: [], hobbies: [] });
  const [message, setMessage] = useState(null);


  useEffect(() => {
  const loadHobbyAndSkills = async () => {
    try {
      const [hobbyRes, skillRes] = await Promise.all([
        hobbyApi.getHobby(),
        skillsetApi.getSkillset()
      ]);

      setOptions({
        hobbies: hobbyRes.data,
        skillsets: skillRes.data
      });
    } catch (error) {
      console.error('Error loading options:', error);
    }
  };

  loadHobbyAndSkills();
}, []);



  useEffect(() => {
    if (freelancer) {
      setFormData({
        username: freelancer.username || '',
        email: freelancer.email || '',
        phone: freelancer.phone || '',
        skillsetIds: freelancer.skillsets?.map(s => s.id) || [],
        hobbyIds: freelancer.hobbies?.map(h => h.id) || []
      });
    } else {
      setFormData({
        username: '',
        email: '',
        phone: '',
        skillsetIds: [],
        hobbyIds: []
      });
    }
  }, [freelancer]);


  const toggleSelection = (id, listName) => {
    setFormData(prev => {
      const list = prev[listName];
      return {
        ...prev,
        [listName]: list.includes(id)
          ? list.filter(i => i !== id)
          : [...list, id]
      };
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await onSave(formData); 
    } catch (err) {
      console.error('Error saving freelancer:', err);
      if (err.response?.data?.details) {
        setMessage(err.response.data.details);
      } else if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        const firstError = apiErrors.Username?.[0] || apiErrors.Email?.[0] || apiErrors.Phone?.[0];
        setMessage(firstError || 'Something went wrong.');
      } else {
        setMessage(err.response?.data?.message || 'Something went wrong.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>
        {freelancer ? 'Edit Freelancer' : 'Add New Freelancer'}
      </h2>

      {message && <p className={styles.error}>{message}</p>}

      {/* Username */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Username:</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          className={styles.input}
        />
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className={styles.input}
        />
      </div>

      {/* Phone */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Phone:</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className={styles.input}
        />
      </div>

      {/* Skills */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Skills:</label>
        {options.skillsets.map(skill => (
          <label key={skill.id} className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={formData.skillsetIds.includes(skill.id)}
              onChange={() => toggleSelection(skill.id, 'skillsetIds')}
            />
            <span className={styles.customCheckbox}></span>
            {skill.skillName}
          </label>
        ))}
      </div>

      {/* Hobbies */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Hobbies:</label>
        {options.hobbies.map(hobby => (
          <label key={hobby.id} className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={formData.hobbyIds.includes(hobby.id)}
              onChange={() => toggleSelection(hobby.id, 'hobbyIds')}
            />
            <span className={styles.customCheckbox}></span>
            {hobby.hobbyName}
          </label>
        ))}
      </div>

      {/* Buttons */}
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
