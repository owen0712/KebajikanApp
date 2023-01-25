import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './footer.css';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class Footer extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <div id="footer">
        <div id='main-content'>
            <span id='left-content'>
                <span>
                    <p className='blue-text'>ABOUT</p>
                    <a className='white-text' href='https://fsktm.um.edu.my/' target="_blank">About Us</a>
                </span>
                <span>
                    <p className='blue-text'>LEGAL</p>
                    <a className='white-text' href='https://www.um.edu.my/privacy-policy.html' target="_blank">Privacy Policy</a>
                    <a className='white-text' href='https://www.um.edu.my/security-policy' target="_blank">Security Policy</a>
                </span>
                <span>
                    <p className='blue-text'>CONTACT</p>
                    <a className='white-text' href='mailto:kebajikanapp@gmail.com'>Contact Us</a>
                </span>
            </span>
            <span id='right-content'>
                <p className='blue-text'>ADDRESS</p>
                <p className='white-text'>Faculty of Computer Science and Information Technology, 50603, Universiti Malaya</p>
            </span>
        </div>
        <hr/>
        <span className='white-text'>Copyright @ 2022 Universiti Malaya</span>
      </div>
    );
  }
}

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;