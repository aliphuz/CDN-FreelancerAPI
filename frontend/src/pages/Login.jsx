import{useState} from 'react';
import { authApi } from '../services/api';
import styles from '../styles/Login.module.css';

const Login = ({ onLoginSuccess }) => {
    const [form,setform] = useState({email:'',password:''});
    const [error,seterror] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        seterror(null);
        try {
            const res = await authApi.login(form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            onLoginSuccess(res.data.role);
        }catch(err) {
            seterror(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
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

        <button type="submit" className={styles.button}>Login</button>
      </form>

      <a href="/register" className={styles.link}>
        Don't have an account? Register
      </a>
    </div>
  );
};

export default Login;