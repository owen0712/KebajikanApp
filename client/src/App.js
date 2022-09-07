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
import CreateNotification from './views/ManageNotification/CreateNotification';
import ManageNotificationDetails from './views/ManageNotification/ManageNotificationDetails';
import ViewNotificationList from './views/ManageNotification/ViewNotificationList';
import CreateItemDonationAppointment from './views/ItemDonation/CreateItemDonationAppointment';
import ManageItemDonationAppointment from './views/ItemDonation/ManageItemDonationAppointment';
import CreateItemDonation from './views/ItemDonation/CreateItemDonation';
import ManageItemDonation from './views/ItemDonation/ManageItemDonation';
import CreateMoneyDonation from './views/MoneyDonation/CreateMoneyDonation';
import MoneyDonationResult from './views/MoneyDonation/MoneyDonationResult';
import DonationHistory from './views/Profile/DonationHistory';
import GenerateReceipt from './views/Profile/DonationHistory/GenerateReceipt';
import ChangePassword from './views/Profile/ChangePassword';
import EmailVerification from './views/Authorization/EmailVerification';
import { UserProvider } from './contexts/UserContext.js';
// import NavRoute from './core/navRoute';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
      <UserProvider>
        <Header/>
        <div id="body">
        <Routes>
          {/* <NavRoute key="404" exact path="/404" name="Page 404" component={Page404} />
          <NavRoute key="500" exact path="/500" name="Page 500" component={Page500} />
          <NavRoute key="home" path="/home" name="Home" component={Announcement} />
          <NavRoute key="login" name="Login Page" component={Login} /> */}
          <Route path='/' element={<ViewAnnouncement/>}/>
          <Route path='/manage_part_time_job/create' element={<CreatePartTimeJob isAdmin={true}/>}/>
          <Route path='/manage_part_time_job' element={<ManagePartTimeJob/>}/>
          <Route path='/manage_part_time_job/view/:id' element={<ManagePartTimeJobDetails isAdmin={true} isEdit={false}/>}/>
          <Route path='/manage_part_time_job/edit/:id' element={<ManagePartTimeJobDetails isAdmin={true} isEdit={true}/>}/>
          <Route path='/part_time_job/apply/:id' element={<ApplyPartTimeJob/>}/>
          <Route path='/part_time_job/view' element={<ViewPartTimeJob/>}/>
          <Route path='/part_time_job/view/:id' element={<ViewPartTimeJobDetails/>}/>
          <Route path='/part_time_job/create' element={<CreatePartTimeJob isAdmin={false}/>}/>
          <Route path='/manage_charity_event' element={<ViewCharityEventList/>}/>
          <Route path='/manage_charity_event/create' element={<CreateCharityEvent isAdmin={true}/>}/>
          <Route path='/manage_charity_event/view/:id' element={<ManageCharityEventDetails isAdmin={true} isEdit={false}/>}/>
          <Route path='/manage_charity_event/edit/:id' element={<ManageCharityEventDetails isAdmin={true} isEdit={true}/>}/>
          <Route path='/charity_event/apply_help/:event_id' element={<ApplyForHelp/>}/>
          <Route path='/charity_event/view' element={<ViewCharityEvent/>}/>
          <Route path='/charity_event/view/:id' element={<ViewCharityEventDetails/>}/>
          <Route path='/charity_event/create' element={<CreateCharityEvent isAdmin={false}/>}/>
          <Route path='/profile/application_history' element={<ApplicationHistory/>}/>
          <Route path='/profile/application_history/job_application/view/:id' element={<ViewJobApplication isEdit={false}/>}/>
          <Route path='/profile/application_history/job_application/edit/:id' element={<ViewJobApplication isEdit={true}/>}/>
          <Route path='/profile/application_history/event_application/view/:id' element={<ViewEventApplication isEdit={false}/>}/>
          <Route path='/profile/application_history/event_application/edit/:id' element={<ViewEventApplication isEdit={true}/>}/>
          <Route path='/profile/application_history/propose_charity_event/view/:id' element={<ManageCharityEventDetails isAdmin={false} isEdit={false}/>}/>
          <Route path='/profile/application_history/propose_charity_event/edit/:id' element={<ManageCharityEventDetails isAdmin={false} isEdit={true}/>}/>
          <Route path='/profile/application_history/propose_part_time_job/view/:id' element={<ManagePartTimeJobDetails isAdmin={false} isEdit={false}/>}/>
          <Route path='/profile/application_history/propose_part_time_job/edit/:id' element={<ManagePartTimeJobDetails isAdmin={false} isEdit={true}/>}/>
          <Route path='/profile' element={<ViewProfile/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/manage_announcement/create' element={<CreateAnnouncement/>}/>
          <Route path='/manage_announcement' element={<ViewAnnouncementList/>}/>
          <Route path='/manage_announcement/view/:id' element={<ManageAnnouncementDetails isEdit={false}/>}/>
          <Route path='/manage_announcement/edit/:id' element={<ManageAnnouncementDetails isEdit={true}/>}/>
          <Route path='/announcement/view' element={<ViewAnnouncement/>}/>
          <Route path='/manage_notification/create' element={<CreateNotification/>}/>
          <Route path='/manage_notification' element={<ViewNotificationList/>}/>
          <Route path='/manage_notification/view/:id' element={<ManageNotificationDetails isEdit={false}/>}/>
          <Route path='/manage_notification/edit/:id' element={<ManageNotificationDetails isEdit={true}/>}/>
          <Route path='/charity_event/appointment/:id' element={<CreateItemDonationAppointment/>}/>
          <Route path='/charity_event/appointment/view/:id' element={<ManageItemDonationAppointment isEdit={false}/>}/>
          <Route path='/charity_event/appointment/edit/:id' element={<ManageItemDonationAppointment isEdit={true}/>}/>
          <Route path='/charity_event/donate_item/fill/:id' element={<CreateItemDonation/>}/>
          <Route path='/charity_event/donate_item/view/:id' element={<ManageItemDonation isEdit={false}/>}/>
          <Route path='/charity_event/donate_item/edit/:id' element={<ManageItemDonation isEdit={true}/>}/>
          <Route path='/charity_event/donate_money/:id' element={<CreateMoneyDonation/>}/>
          <Route path='/charity_event/donate_money/success/:id' element={<MoneyDonationResult isSuccess={true}/>}/>
          <Route path='/charity_event/donate_money/failed/:id' element={<MoneyDonationResult isSuccess={false}/>}/>
          <Route path='/charity_event/generate_receipt/:id' element={<GenerateReceipt/>}/>
          <Route path='/profile/donation_history' element={<DonationHistory/>}/>
          <Route path='/profile/password' element={<ChangePassword/>}/>
          <Route path='/activate/:id' element={<EmailVerification/>}/>
        </Routes>
        </div>
        <Footer/>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;