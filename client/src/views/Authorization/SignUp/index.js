import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './signup.css';
import logo from '../../../assets/img/signup.png'

const SignUp = (props) => {

    const [name,setName] = useState(""); 
    const [email,setEmail] = useState("");
    const [phone_number,setPhoneNumber] = useState(""); 
    const [identity_no,setIdentityNo] = useState("");
    const [birthdate,setBirthDate] = useState(""); 
    const [password,setPassword] = useState("");
    const [confirm_password,setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleNameOnChange = (event) => {
        setName(event.target.value);
    }

    const handleEmailOnChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePhoneNumberOnChange = (event) => {
        setPhoneNumber(event.target.value);
    }

    const handleIdentityNoOnChange = (event) => {
        setIdentityNo(event.target.value);
    }

    const handleBirthDateOnChange = (event) => {
        setBirthDate(event.target.value);
    }

    const handlePasswordOnChange = (event) => {
        setPassword(event.target.value);
    }

    const handleConfirmPasswordOnChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        fetch('/signup',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name,
                phone_number,
                identity_no,
                email,
                birthdate,
                password
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                navigate('/login')
            }
        }).catch(err=>{
            console.log(err);
        })
    }
        
    return (
        <div id="signup-section">
            <form id="sign-up-form">
                <h1>SIGNUP</h1>
                <span>
                    <label>FULL NAME *</label>
                    <input type="text" onChange={event=>handleNameOnChange(event)}/>
                </span>
                <span>
                    <label>EMAIL *</label>
                    <input type="email" onChange={event=>handleEmailOnChange(event)}/>
                </span>
                <span>
                    <label>PHONE NUMBER *</label>
                    <input type="text" onChange={event=>handlePhoneNumberOnChange(event)}/>
                </span>
                <span className='half-section'>
                    <span>
                        <label>ID NO</label>
                        <input type="text" onChange={event=>handleIdentityNoOnChange(event)}/>
                    </span>
                    <span>
                        <label>BIRTHDATE</label>
                        <input type="date" defaultValue={new Date().toISOString().substr(0,10)} onChange={event=>handleBirthDateOnChange(event)}/>
                    </span>
                    
                </span>
                <span className='half-section'>
                    <span>
                        <label>PASSWORD *</label>
                        <input type="password" onChange={event=>handlePasswordOnChange(event)}/>
                    </span>
                    <span>
                        <label>CONFIRM PASSWORD *</label>
                        <input type="password" onChange={event=>handleConfirmPasswordOnChange(event)}/>
                    </span>
                </span>
                <input id="signup-button" type="submit" value="SIGNUP"/>
            </form>
            <div id="image">
                <span>
                    <h2>Register to join</h2>
                    <h2>Kebajikan App</h2>
                </span>
                <img src={logo} />
            </div>
            
        </div>
    )
}


export default SignUp;