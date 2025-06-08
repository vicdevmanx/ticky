import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AuthProtected = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('tickyAuthToken');
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Optional: Render null or a loader while checking auth
  if (!token) return null;

  return <>{children}</>;
};

export default AuthProtected;
