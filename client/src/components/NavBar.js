import {Link,useNavigate} from 'react-router-dom';

const NavBar = ({user,clearUserData}) => {

    const navigate = useNavigate();

    const setUserLogout = () =>{
        clearUserData();
        navigate('/');
    }

    return (
        <div id='main-navbar'>
            <div id='content-section'>
                <div><Link to='/'>Home</Link></div>
                <div>What's News</div>
                <div>About Us</div>
            </div>
            {!user&&<div id='user-section'>
                <div id='login'><i className="fa-solid fa-user"/><Link to='/login'>Login</Link></div>
                <div id='signup'><i className="fa-solid fa-pen"/><Link to='/signup'>Sign Up</Link></div>
            </div>}
            
            {user && <div id='user-section'>
                {user.userType&&<div id='admin'><i className="fa-solid fa-chart-bar"/><Link to='/dashboard'>Dashboard</Link></div>}
                <div id='event'><i className="fa-solid fa-calendar"/><Link to='/event'>History</Link></div>
                <div id='profile'><i className="fa-solid fa-user"/><Link to='/profile'>Profile</Link></div>
                <div id='logout' onClick={setUserLogout}><i className="fa-solid fa-right-to-bracket"/><Link to=''>Logout</Link></div>
            </div>}
        </div>
    );
}

export default NavBar;