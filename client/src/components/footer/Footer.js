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
                    <a className='white-text'>About Us</a>
                    <a className='white-text'>FAQs</a>
                </span>
                <span>
                    <p className='blue-text'>LEGAL</p>
                    <a className='white-text'>Terms of Use</a>
                    <a className='white-text'>Privacy Policy</a>
                    <a className='white-text'>Cookie Policy</a>
                </span>
                <span>
                    <p className='blue-text'>CONNECT</p>
                    <a className='white-text'>Contact Us</a>
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