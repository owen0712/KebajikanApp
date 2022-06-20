import React, { Component } from "react";
import PropTypes from "prop-types";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "./header.css";
import { Link } from "react-router-dom";
// import { SessionService } from "services";
// import Environment from "../../environment";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

//   onLogout = () => {
//     SessionService.logout()
//       .then((resp) => {
//         console.log("logout successfully:", resp);
//         SessionService.clearSession();
//       })
//       .catch((error) => {
//         console.log("logout failed:", error);
//         SessionService.clearSession();
//       });

//     this.props.onLogout();
//   };

  render() {
    return (
      <div id="header">
        {/* <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppSidebarToggler className="d-md-down-none" display="lg" /> */}
        <nav id="">
            <span><Link to='/' className="logo-name white-text">Kebajikan App</Link></span>
            <span><Link to='/announcement/view' className="nav-item white-text">ANNOUNCEMENT</Link></span>
            <span><Link to='/charity_event/view' className="nav-item white-text">CHARITY EVENT</Link></span>
            <span><Link to='/' className="nav-item white-text">PART-TIME JOB</Link></span>
            <span><Link to='/' className="nav-item white-text">ABOUT US</Link></span>
        </nav>
        <nav id="user-section">
            <span><Link to='/login' className="nav-item white-text">Sign In</Link></span>
            <AccountCircleIcon className="nav-item"/>
        </nav>
      </div>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
