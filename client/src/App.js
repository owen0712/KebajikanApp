import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateCharityEvent from './views/ManageCharityEvent/CreateCharityEvent';
import CreatePartTimeJob from './views/ManagePartTimeJob/CreatePartTimeJob';
import ManagePartTimeJob from './views/ManagePartTimeJob/ManagePartTimeJob';
import ManagePartTimeJobDetails from './views/ManagePartTimeJob/ManagePartTimeJobDetails';
import ViewPartTimeJob from './views/PartTimeJob/ViewPartTimeJob';
import ViewPartTimeJobDetails from './views/PartTimeJob/ViewPartTimeJobDetails';
import ApplyPartTimeJob from './views/PartTimeJob/ApplyPartTimeJob';
import ViewCharityEventList from './views/ManageCharityEvent/ViewCharityEventList';
import ManageCharityEventDetails from './views/ManageCharityEvent/ManageCharityEventDetails';
import ApplyForHelp from './views/CharityEvent/ApplyForHelp';
import ViewCharityEvent from './views/CharityEvent/ViewCharityEvent';
import ViewCharityEventDetails from './views/CharityEvent/ViewCharityEventDetails';
import ApplicationHistory from './views/Profile/ApplicationHistory';
import Login from './views/Authorization/Login';
import SignUp from './views/Authorization/SignUp';
import Admin from './views/Admin';
import { useState } from 'react';
// import NavRoute from './core/navRoute';

function App() {

  const [isAuthenticated,setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>
        <div id="body">
        <Routes>
          {/* <NavRoute key="404" exact path="/404" name="Page 404" component={Page404} />
          <NavRoute key="500" exact path="/500" name="Page 500" component={Page500} />
          <NavRoute key="home" path="/home" name="Home" component={Announcement} />
          <NavRoute key="login" name="Login Page" component={Login} /> */}
          <Route path='/manage_part_time_job/create' element={<CreatePartTimeJob/>}/>
          <Route path='/manage_part_time_job' element={<ManagePartTimeJob/>}/>
          <Route path='/manage_part_time_job/view/:id' element={<ManagePartTimeJobDetails isEdit={false}/>}/>
          <Route path='/manage_part_time_job/edit/:id' element={<ManagePartTimeJobDetails isEdit={true}/>}/>
          <Route path='/part_time_job/apply/:id' element={<ApplyPartTimeJob/>}/>
          <Route path='/part_time_job/view' element={<ViewPartTimeJob/>}/>
          <Route path='/part_time_job/view/:id' element={<ViewPartTimeJobDetails/>}/>
          <Route path='/manage_charity_event' element={<ViewCharityEventList/>}/>
          <Route path='/manage_charity_event/create' element={<CreateCharityEvent/>}/>
          <Route path='/manage_charity_event/view/:id' element={<ManageCharityEventDetails isEdit={false}/>}/>
          <Route path='/manage_charity_event/edit/:id' element={<ManageCharityEventDetails isEdit={true}/>}/>
          <Route path='/charity_event/apply_help/:id' element={<ApplyForHelp/>}/>
          <Route path='/charity_event/view' element={<ViewCharityEvent/>}/>
          <Route path='/charity_event/view/:id' element={<ViewCharityEventDetails/>}/>
          <Route path='/profile/application_history' element={<ApplicationHistory/>}/>
          <Route path='/login' element={<Login handleLogin={handleLogin}/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/admin' element={<Admin/>}/>
        </Routes>
        </div>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;