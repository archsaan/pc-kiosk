import React, { useState,useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible,AiOutlineDown   } from 'react-icons/ai';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [facility, setFacility] = useState('');
  const [loading, setLoading] = useState(false);  
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState('');
  const [facilityData, setFacilityData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacilities = async () => {
    
      const response = {
        facility: [
          {
            index: 1,
            country: "UAE",
            studios: [
              { id: "1", name: "Reset Fitness JIP" },
              { id: "2", name: "HQ Testing" }
            ]
          },
          {
            index: 2,
            country: "UK",
            studios: [
              { id: "5", name: "Staff Testing" }
            ]
          }
        ]
      };
      setFacilityData(response.facility);
    };

    fetchFacilities();
  }, []);

  // 🟢 Get filtered studios based on selected country
  const availableStudios = facilityData.find(f => f.country === country)?.studios || [];

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        {/* Form */}
        <div className="space-y-4">
           <div className='relative'>
            <select
              id="country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setFacility(''); 
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select a Country</option>
              {facilityData.map(item => (
                <option key={item.country} value={item.country}>
                  {item.country}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <AiOutlineDown  size={18} />
            </div>
          </div>

          {/* Facility Dropdown */}
          <div className='relative'>
            <select
              id="facility"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="w-full p-3 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              disabled={!country}
            >
              <option value="">Select a Facility</option>
              {availableStudios.map(studio => (
                <option key={studio.id} value={studio.id}>
                  {studio.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <AiOutlineDown  size={18} />
            </div>
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
          <div className='relative'>
           
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </span>
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
