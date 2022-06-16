import React from 'react';
import './announcement.css';

function Announcement(props) {
    return (
        <form>
            <span className="file-upload">
                <label >Cover Photo</label>
                <input type="file"/>
            </span>
        </form>
    );
}

export default Announcement;