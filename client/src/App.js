import './App.css';
import {useState} from 'react';
import {BrowserRouter,Route,Routes,Navigate} from 'react-router-dom';
import NavBar from './components/NavBar.js';
import Login from './components/Login.js';
import SignUp from './components/SignUp.js';
import Footer from './components/Footer.js';

function App() {
  const [user,setUser]=useState(null);

  const setUserData =  (userData) =>{
    setUser(userData);
  }

  const clearUserData = () =>{
    setUser(null);
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar user={user} clearUserData={clearUserData}/>
        <Routes>
          {/* <Route path='/' element={<Home/>}/> */}
          <Route path='/login' element={<Login setUserData={setUserData}/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;