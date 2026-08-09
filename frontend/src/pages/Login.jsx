import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { validateEmail } from '../utils/helper';
import { useAuth } from '../context/AuthContext';

function Login() { 
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const togglePasswordVisibility = () => setIsShowPassword((prev) => !prev);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <p className="authBrand">LuxeStay</p>
        <p className="authTitle">Log in to book your stays</p>

        <form onSubmit={handleLogin}>
          {error && <div className="authError">{error}</div>}

       
          <div className="authField">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="authField authPasswordRow">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type={isShowPassword ? "text" : "password"}
              placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="autheye" onClick={togglePasswordVisibility}
              aria-label={isShowPassword ? 'Hide password' : 'Show password'}>
              {isShowPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button className="authSubmit" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="authSwitch">
          Don't have an account? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login