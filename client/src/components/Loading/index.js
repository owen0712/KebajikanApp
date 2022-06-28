import React,{ Component } from 'react';
import "./Loading.css";

class Loading extends Component {
    render(){
        return (
            <div className="spinner-container">
                <div className="loading-spinner">
                </div>
                <h2 id="loading-text">Loading...</h2>
            </div>
        )
    }
}

export default Loading;