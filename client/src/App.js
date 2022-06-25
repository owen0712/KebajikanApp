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
import ViewJobApplication from './views/Profile/ApplicationHistory/ViewJobApplication';
import ViewEventApplication from './views/Profile/ApplicationHistory/ViewEventApplication';
import ViewProfile from './views/Profile/ViewProfile';
import Login from './views/Authorization/Login';
import SignUp from './views/Authorization/SignUp';
import Admin from './views/Admin';
import CreateAnnouncement from './views/Announcement/CreateAnnouncement';
import ViewAnnouncementList from './views/Announcement/ViewAnnouncementList';
import ManageAnnouncementDetails from './views/Announcement/ManageAnnouncementDetails';
import ViewAnnouncement from './views/Announcement/ViewAnnouncement';
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
          <Route path='/' element={<ViewAnnouncement/>}/>
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
          <Route path='/charity_event/apply_help/:event_id' element={<ApplyForHelp/>}/>
          <Route path='/charity_event/view' element={<ViewCharityEvent/>}/>
          <Route path='/charity_event/view/:id' element={<ViewCharityEventDetails/>}/>
          <Route path='/profile/application_history' element={<ApplicationHistory/>}/>
          <Route path='/profile/application_history/job_application/view/:id' element={<ViewJobApplication isEdit={false}/>}/>
          <Route path='/profile/application_history/job_application/edit/:id' element={<ViewJobApplication isEdit={true}/>}/>
          <Route path='/profile/application_history/event_application/view/:id' element={<ViewEventApplication isEdit={false}/>}/>
          <Route path='/profile/application_history/event_application/edit/:id' element={<ViewEventApplication isEdit={true}/>}/>
          <Route path='/profile' element={<ViewProfile/>}/>
          <Route path='/login' element={<Login handleLogin={handleLogin}/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/manage_announcement/create' element={<CreateAnnouncement/>}/>
          <Route path='/manage_announcement' element={<ViewAnnouncementList/>}/>
          <Route path='/manage_announcement/view/:id' element={<ManageAnnouncementDetails isEdit={false}/>}/>
          <Route path='/manage_announcement/edit/:id' element={<ManageAnnouncementDetails isEdit={true}/>}/>
          <Route path='/announcement/view' element={<ViewAnnouncement/>}/>
        </Routes>
        </div>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;