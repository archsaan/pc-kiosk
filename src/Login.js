import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [facility, setFacility] = useState('');
  const [loading, setLoading] = useState(false);  // State for loading indicator
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!facility) {
      toast.error('Please select a facility');
      return;
    }
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    const payload = {
      username,
      password,
      facility_id: facility,
      franchise_id: "",  // Leave franchise_id empty if not required
    };

    setLoading(true);  // Set loading to true when making the API call

    try {
      const response = await axios.post(
        'https://backend.profitconnect.co/crm/franchise/get/login',
        payload
      );

      // Check if the API call was successful
      if (response.data.return === true) {
        toast.success('Login successful');
        localStorage.setItem('facility_id',"") 
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role_id', response.data.role_id);
        localStorage.setItem('facility_id', facility); 
        navigate('/');  
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login. Please try again later.');
    } finally {
      setLoading(false);  // Set loading to false when API call is finished
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        {/* Form */}
        <div className="space-y-4">
          {/* Facility Dropdown */}
          <div>
           
            <select
              id="facility"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a facility</option>
              <option value="2">HQ Testing</option>
              <option value="1">Reset JIP</option>
            
            </select>
          </div>

          {/* Username */}
          <div>
           
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
           
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
