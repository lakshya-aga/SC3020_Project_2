import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import MainPage from './components/MainPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={'/login'} element={<Login/>}/>
        <Route path={'/'} exact element={<MainPage/>}/>      
      </Routes>
    </Router>
  );
}

export default App;
