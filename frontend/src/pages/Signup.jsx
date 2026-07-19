import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import { useAuth } from '../context/AuthContext';

function Signup() {
 const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { signup } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [error, setError] = useState("");
 const [loading,setLoading]=useState(false)

  const togglePasswordVisibility = () => {
    setIsShowPassword((prev) => !prev);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

  
      setLoading(true);
    try {
      await signup({ username, email, password });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <p className="authBrand">HOTEL PRUDENCE</p>
        <p className="authTitle">Create your account</p>

        <form onSubmit={handleSignup}>
          {error && <div className="authError">{error}</div>}

          <div className="authField">
            <label htmlFor="signup-username">Username</label>
            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="authField">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="authField">
            <label htmlFor="signup-password">Password</label>
            <div className="authPasswordRow">
              <input
                id="signup-password"
                type={isShowPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="autheye"
                onClick={togglePasswordVisibility}
                aria-label={isShowPassword ? 'Hide password' : 'Show password'}
              >
                {isShowPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="authField">
            <label htmlFor="signup-confirm">Confirm password</label>
            <input
              id="signup-confirm"
              type={isShowPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="authSubmit" type="submit">
            Create account
          </button>
        </form>

        <p className="authSwitch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup