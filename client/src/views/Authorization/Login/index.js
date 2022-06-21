import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './login.css';
import logo from '../../../assets/img/login.png'

const Login = (props) => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleEmailOnChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordOnChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        fetch('/login',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                console.log(data.message);
            }
        }).catch(err=>{
            console.log(err);
        })
    }
        
    return (
        <div id="signup-section">
            <div id="image">
                <span>
                    <h2>Register to join</h2>
                    <h2>Kebajikan App</h2>
                </span>
                <img src={logo} />
            </div>
            <form id="sign-up-form">
                <h1>LOGIN</h1>
                <span>
                    <label>EMAIL *</label>
                    <input type="email" onChange={event=>handleEmailOnChange(event)}/>
                </span>
                <span>
                    <label>PASSWORD *</label>
                    <input type="password" onChange={event=>handlePasswordOnChange(event)}/>
                </span>
                <input id="signup-button" type="submit" value="SIGNUP"/>
            </form>
        </div>
    )
}


export default Login;