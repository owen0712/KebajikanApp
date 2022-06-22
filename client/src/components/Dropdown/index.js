import React,{ Component } from 'react';
import './Dropdown.css';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { borderRadius } from '@mui/system';

class Dropdown extends Component{
    
    render(){
        const styling = {
            width:"90%", 
            height: "50px",
            fontFamily: "\"Roboto Condensed\" !important",
            fontWeight: "bold",
            color: "#192F59",
            fontSize: "15px",
            border: "3px solid #192F59",
            borderRadius: "0"
        };

        return(
            <span className="short-input dropdown">
                <label >{(this.props.label)&&this.props.label}</label>
                <Select
                    labelId="dropdown-label"
                    id="dropdown"
                    value={this.props.value}
                    label="Course"
                    onChange={this.props.handleOnChange}
                    style={styling}
                >
                    {
                    this.props.optionList.map(item=>{
                        return(<MenuItem key={item} value={item}>{item}</MenuItem>)
                    })}
                </Select>
            </span>
            )
    }
}

export default Dropdown;