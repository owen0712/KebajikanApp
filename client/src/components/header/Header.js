import React, { Component } from "react";
import PropTypes from "prop-types";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "./header.css";
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
            <span><a className="logo-name white-text">Kebajikan App</a></span>
            <span><a className="nav-item white-text">ANNOUNCEMENT</a></span>
            <span><a className="nav-item white-text">CHARITY EVENT</a></span>
            <span><a className="nav-item white-text">PART-TIME JOB</a></span>
            <span><a className="nav-item white-text">ABOUT US</a></span>
        </nav>
        <nav id="user-section">
            <span><a className="nav-item white-text">Sign In</a></span>
            <AccountCircleIcon className="nav-item"/>
        </nav>
      </div>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
