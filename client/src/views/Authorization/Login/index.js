import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import './login.css';
import logo from '../../../assets/img/login.png'
import Swal from 'sweetalert2';

const Login = (props) => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = props.handleLogin;

    const handleEmailOnChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordOnChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        fetch('/signin',{
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
                Swal.fire({
                    icon:"error",
                    title:data.error
                })
            }
            else{
                sessionStorage.setItem("jwt",data.token)
                sessionStorage.setItem("user",JSON.stringify(data.user))
                handleLogin();
                Swal.fire({
                    icon:"success",
                    title:data.message
                })
                .then(()=>{
                    navigate("/");
                })
            }
        }).catch(err=>{
            Swal.fire({
                icon:"error",
                message:err
            })
        })
    }
        
    return (
        <div id="login-section">
            {sessionStorage.getItem("user")!=null?<Navigate to="/"/>:<></>}
            <div id="login-image">
                <span>
                    <h2>WELCOME BACK!</h2>
                </span>
                <img src={logo} />
            </div>
            <form id="login-form" onSubmit={event=>handleSubmit(event)}>
                <h1>LOGIN</h1>
                <span>
                    <label>EMAIL *</label>
                    <input type="email" name="email" onChange={event=>handleEmailOnChange(event)}/>
                </span>
                <span>
                    <label>PASSWORD *</label>
                    <input type="password" name="password" onChange={event=>handlePasswordOnChange(event)}/>
                </span>
                <input id="login-button" type="submit" value="LOGIN"/>
                <Link to="/forgot_password">FORGOT PASSWORD?</Link>
                <Link to="/signup">SIGN UP NOW</Link>
            </form>
        </div>
    )
}


export default Login;