import React, { Component } from 'react'
import PropTypes from "prop-types";
import './charity_event.css';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class CharityEvent extends Component {
  render() {
    return (
      <div>index</div>
    )
  }
}

CharityEvent.propTypes = propTypes;
CharityEvent.defaultProps = defaultProps;

export default CharityEvent;