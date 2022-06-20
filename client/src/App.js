import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateCharityEvent from './views/ManageCharityEvent/CreateCharityEvent';
import CreatePartTimeJob from './views/ManagePartTimeJob/CreatePartTimeJob';
import ViewPartTimeJob from './views/ManagePartTimeJob/ViewPartTimeJob';
import ViewPartTimeJobDetails from './views/ManagePartTimeJob/ViewPartTimeJobDetails';
import ViewCharityEventList from './views/ManageCharityEvent/ViewCharityEventList';
import ManageCharityEventDetails from './views/ManageCharityEvent/ManageCharityEventDetails';
import ApplyForHelp from './views/CharityEvent/ApplyForHelp';
import ViewCharityEvent from './views/CharityEvent/ViewCharityEvent';
import ViewCharityEventDetails from './views/CharityEvent/ViewCharityEventDetails';
import Login from './views/Authorization/Login';
import SignUp from './views/Authorization/SignUp';
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
          <Route path='/manage_part_time_job/create' element={<CreatePartTimeJob/>}/>
          <Route path='/manage_part_time_job' element={<ViewPartTimeJob/>}/>
          <Route path='/manage_part_time_job/view/:id' element={<ViewPartTimeJobDetails isEdit={false}/>}/>
          <Route path='/manage_part_time_job/edit/:id' element={<ViewPartTimeJobDetails isEdit={true}/>}/>
          <Route path='/manage_charity_event' element={<ViewCharityEventList/>}/>
          <Route path='/manage_charity_event/create' element={<CreateCharityEvent/>}/>
          <Route path='/manage_charity_event/view/:id' element={<ManageCharityEventDetails isEdit={false}/>}/>
          <Route path='/manage_charity_event/edit/:id' element={<ManageCharityEventDetails isEdit={true}/>}/>
          <Route path='/charity_event/apply_help/:id' element={<ApplyForHelp/>}/>
          <Route path='/charity_event/view' element={<ViewCharityEvent/>}/>
          <Route path='/charity_event/view/:id' element={<ViewCharityEventDetails/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
        </Routes>
        </div>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;