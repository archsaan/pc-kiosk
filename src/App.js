import './App.css';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Checkin from './Checkin';
import Login from './Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');  
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
         <Route path='/' element={<Checkin/>} />
         <Route path='/login' element={<Login />} /> 
       </Routes>
       <ToastContainer 
        position="top-right"  // You can set the position of the toast (top-right, bottom-left, etc.)
        autoClose={5000}      // Auto-close after 5 seconds
        hideProgressBar={false}  // Optionally show or hide the progress bar
        newestOnTop={true}    // Newest toast appears on top
        closeOnClick={true}   // Close the toast when clicked
        rtl={false}           // Set to true for right-to-left language
        pauseOnFocusLoss={false} // Pause the toast when the window is blurred
        draggable={true}      // Enable dragging the toast
      />
    </div>
  );
}

export default App;
