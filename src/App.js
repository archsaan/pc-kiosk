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
        position="top-right"  
        autoClose={5000}      
        hideProgressBar={false}  
        newestOnTop={true}    
        closeOnClick={true}  
        rtl={false}          
        pauseOnFocusLoss={false} 
        draggable={true}     
      />
    </div>
  );
}

export default App;
