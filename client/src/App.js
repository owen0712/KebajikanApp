import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Header from './components/header/Header.js';
import Footer from './components/footer/Footer.js';
import CreateCharityEvent from './views/ManageCharityEvent/CreateCharityEvent';
import CreatePartTimeJob from './views/ManagePartTimeJob/CreatePartTimeJob';
import ViewCharityEvent from './views/ManageCharityEvent/ViewCharityEvent';
import ViewCharityEventDetails from './views/ManageCharityEvent/ViewCharityEventDetails';
import EditCharityEvent from './views/ManageCharityEvent/EditCharityEvent';
import ApplyForHelp from './views/CharityEvent/ApplyForHelp';
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
          <Route path='/managePartTimeJob/createPartTimeJob' element={<CreatePartTimeJob/>}/>
          <Route path='/manage_charity_event' element={<ViewCharityEvent/>}/>
          <Route path='/manage_charity_event/create' element={<CreateCharityEvent/>}/>
          <Route path='/manage_charity_event/view/:id' element={<ViewCharityEventDetails/>}/>
          <Route path='/manage_charity_event/edit/:id' element={<EditCharityEvent/>}/>
          <Route path='/manage_charity_event/edit/:id' element={<EditCharityEvent/>}/>
          <Route path='/charity_event/apply_help/:id' element={<ApplyForHelp/>}/>
        </Routes>
        </div>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;