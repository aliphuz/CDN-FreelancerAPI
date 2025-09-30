import { useState, useEffect } from 'react';
import styles from '../styles/FreelancerForm.module.css';
import { freelancerApi } from '../services/api';

const FreelancerForm = ({ freelancer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    skillsetIds: [],
    hobbyIds: []
  });

  const [skillOptions, setSkillOptions] = useState([]);
  const [hobbyOptions, setHobbyOptions] = useState([]);

  useEffect(() => {
    // Load options from backend
    const loadOptions = async () => {
      const skills = await freelancerApi.getSkillOptions();
      const hobbies = await freelancerApi.getHobbyOptions();
      setSkillOptions(skills.data);
      setHobbyOptions(hobbies.data);
    };
    loadOptions();

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

  const toggleSelection = (type, id) => {
    setFormData(prev => {
      const list = prev[type];
      return {
        ...prev,
        [type]: list.includes(id) ? list.filter(x => x !== id) : [...list, id]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>
        {freelancer ? 'Edit Freelancer' : 'Add New Freelancer'}
      </h2>

      {/* Basic fields */}
      <div className={styles.formGroup}>
        <label>Username</label>
        <input type="text" value={formData.username}
               onChange={e => setFormData({ ...formData, username: e.target.value })}
               required />
      </div>

      <div className={styles.formGroup}>
        <label>Email</label>
        <input type="email" value={formData.email}
               onChange={e => setFormData({ ...formData, email: e.target.value })}
               required />
      </div>

      <div className={styles.formGroup}>
        <label>Phone</label>
        <input type="text" value={formData.phone}
               onChange={e => setFormData({ ...formData, phone: e.target.value })}
               required />
      </div>

      {/* Skill selection */}
      <div className={styles.formGroup}>
        <label>Skills</label>
        <div className={styles.chipContainer}>
          {skillOptions.map(skill => (
            <span key={skill.id}
                  onClick={() => toggleSelection("skillsetIds", skill.id)}
                  className={`${styles.chip} ${formData.skillsetIds.includes(skill.id) ? styles.selected : ''}`}>
              {skill.skillName}
            </span>
          ))}
        </div>
      </div>

      {/* Hobby selection */}
      <div className={styles.formGroup}>
        <label>Hobbies</label>
        <div className={styles.chipContainer}>
          {hobbyOptions.map(hobby => (
            <span key={hobby.id}
                  onClick={() => toggleSelection("hobbyIds", hobby.id)}
                  className={`${styles.chip} ${formData.hobbyIds.includes(hobby.id) ? styles.selected : ''}`}>
              {hobby.hobbyName}
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
