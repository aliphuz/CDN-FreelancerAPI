import {useState} from 'react';
import { authApi } from '../services/api';
import styles from '../styles/Register.module.css';
import { useNavigate } from 'react-router-dom';


const Register = ({ onRegisterSuccess }) => {
    const [form,setForm] = useState({username:'',email:'',password:'',role:'User'});
    const [message,setMessage] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
          const res = await authApi.register(form);
          setMessage('Registration successful! You can now log in.');
          setForm({username:'',email:'',password:'',role:'User'});
          if(typeof onRegisterSuccess === 'function') {
            onRegisterSuccess();
          }
           navigate('/Login');
        }catch(err) {
          setMessage(err.response?.data?.message || 'Registration failed');
        }
      };
    


    return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>

      {message && (
        <p className={message.includes('failed') ? styles.error : styles.message}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username:</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>Register</button>
      </form>

      <a href="/login" className={styles.link}>
        Already have an account? Login
      </a>
    </div>
  );
};

export default Register;