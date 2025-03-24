import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Checkin from './Checkin';

function App() {
  return (
    <div className="App">
      <Routes>
         <Route path='/' element={<Checkin/>} />
       </Routes>
    </div>
  );
}

export default App;
