import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import './forgot_password.css';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const ForgotPassword = (props) => {

    const [email,setEmail] = useState("");
    const [isSubmit,setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const user = useUser();

    useEffect(()=>{
        let timer = null;
        if(user){
            navigate('/')
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    const handleEmailOnChange = (event) => {
        setEmail(event.target.value);
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        fetch('/forgot_password',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    icon:"error",
                    title:data.error
                })
            }
            else{
                setIsSubmit(true);
            }
        }).catch(err=>{
            Swal.fire({
                icon:"error",
                message:err
            })
        })
    }
        
    return (
        <div id="forgot-password-section">
            {user!=null?<Navigate to="/"/>:<></>}
            <div id="forgot-password-upper-section">
                <EmailOutlinedIcon/>
                <h1>Forgot Password?</h1>
                <p>No worries, we'll  send you reset instructions</p>
            </div>
            {isSubmit?<h4>Reset password instructions has been sent to your email.</h4>
            :<form id="forgot-password-form" onSubmit={event=>handleSubmit(event)}>
                <span>
                    <label>EMAIL</label>
                    <input type="email" name="email" onChange={event=>handleEmailOnChange(event)}/>
                </span>
                <input id="send-button" type="submit" value="SEND EMAIL"/>
            </form>}
            <div id='back-to-login-section'>
                <Link to="/login"><ArrowBackIcon/>Back to log in</Link>
            </div>
        </div>
    )
}


export default ForgotPassword;