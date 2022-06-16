import './App.css';
import {HashRouter,Route,Routes} from 'react-router-dom';
import Header from './components/header/Header.js';
import Footer from './components/footer/Footer.js';
import Announcement from './views/Announcement/Announcement.js';

function App() {

  return (
    <div className="App">
      <HashRouter>
        <Header/>
        <Routes>
          <NavRoute key="404" exact path="/404" name="Page 404" component={Page404} />
          <NavRoute key="500" exact path="/500" name="Page 500" component={Page500} />
          <NavRoute key="home" path="/home" name="Home" component={DefaultLayout} />
          <NavRoute key="login" name="Login Page" component={Login} />
        </Routes>
        <Footer/>
      </HashRouter>
    </div>
  );
}

export default App;