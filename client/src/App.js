import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Header from './components/header/Header.js';
import Footer from './components/footer/Footer.js';
import CreateCharityEvent from './views/ManageCharityEvent/CreateCharityEvent';
// import NavRoute from './core/navRoute';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <div id="body">
        <Routes>
          {/* <NavRoute key="404" exact path="/404" name="Page 404" component={Page404} />
          <NavRoute key="500" exact path="/500" name="Page 500" component={Page500} />
          <NavRoute key="home" path="/home" name="Home" component={Announcement} />
          <NavRoute key="login" name="Login Page" component={Login} /> */}
          <Route path='/announcement' element={<CreateCharityEvent/>}/>
        </Routes>
        </div>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;