import { useState, useEffect } from 'react';
import { freelancerApi } from '../services/api';
import styles from '../styles/FreelancerForm.module.css';

const FreelancerForm = ({ freelancer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    skillsetIds: [],
    hobbyIds: []
  });

  const [options, setOptions] = useState({ skillsets: [], hobbies: [] });

 
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const res = await freelancerApi.getOptions();
        setOptions(res.data);
      } catch (err) {
        console.error("Error loading options:", err);
      }
    };
    loadOptions();
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
    }
  }, [freelancer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSave(formData); 
  };

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

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>
        {freelancer ? 'Edit Freelancer' : 'Add New Freelancer'}
      </h2>

      {/* Username */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Username:</label>
        <input
          type="text"
          name="username"
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
          name="email"
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
          name="phone"
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
