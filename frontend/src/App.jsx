import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HobbyManagement from './components/HobbyManagement';
import SkillManagement from './components/SkillManagement';
import { authApi } from './services/api';

function App() {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const verifyUser = async () => {
    try {
      const res = await authApi.getCurrentUser(); 
      if (res.status === 200) {
        const data = res.data;
        setIsAuthenticated(true);
        setRole(data.role);
        setUserId(data.userId);
      } else {
        setIsAuthenticated(false);
        setRole(null);
        setUserId(null);
      }
    } catch {
      setIsAuthenticated(false);
      setRole(null);
      setUserId(null);
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
   
    verifyUser();
  }, []);

  if (!authChecked) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <Login onLoginSuccess={(loginData) => {
              
              setIsAuthenticated(true);
              setRole(loginData.role);
              setUserId(loginData.userId);
            }} />
          } 
        />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Dashboard 
                setRole={setRole} 
                setIsAuthenticated={setIsAuthenticated}
                role={role}
                userId={userId}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        <Route
          path="/hobbies"
          element={
            isAuthenticated && role === 'Admin' ? (
              <HobbyManagement />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        <Route
          path="/skills"
          element={
            isAuthenticated && role === 'Admin' ? (
              <SkillManagement />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
