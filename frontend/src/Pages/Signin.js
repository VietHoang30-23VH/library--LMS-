import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext.js';
import Switch from '@material-ui/core/Switch';
import './Signin.css';

const API_URL = process.env.REACT_APP_API_URL;

function Signin() {
  const history = useHistory();
  const [isStudent, setIsStudent] = useState(true);
  const [credentials, setCredentials] = useState({
    admissionId: '',
    employeeId: '',
    password: ''
  });
  const [error, setError] = useState("");
  const { dispatch } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const loginCall = async (userCredential) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(API_URL + "api/auth/signin", userCredential);
      dispatch({ 
        type: "LOGIN_SUCCESS", 
        payload: res.data 
      });
      
      // Redirect based on admin status
      if (res.data.isAdmin) {
        history.push('/dashboard@admin');
      } else {
        history.push('/dashboard@member');
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE" });
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = isStudent 
      ? { admissionId: credentials.admissionId, password: credentials.password }
      : { employeeId: credentials.employeeId, password: credentials.password };
    
    loginCall(payload);
  };

  return (
    <div className='signin-container'>
      <div className="signin-card">
        <form onSubmit={handleSubmit}>
          <h2 className="signin-title">Log In</h2>
          
          <div className="persontype-question">
            <p>Are you a Staff member?</p>
            <Switch
              checked={!isStudent}
              onChange={() => setIsStudent(!isStudent)}
              color="primary"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="signin-fields">
            <label>
              {isStudent ? "Admission ID" : "Employee ID"}
            </label>
            <input
              type="text"
              name={isStudent ? "admissionId" : "employeeId"}
              value={isStudent ? credentials.admissionId : credentials.employeeId}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <button type="submit" className="signin-button">
            Log In
          </button>

          <div className="signup-option">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Sign up here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;