import VpnKeyIcon from '@mui/icons-material/VpnKey';
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import './reset_password.css';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const ResetPassword = (props) => {

    const [password,setPassword] = useState("");
    const [confirm_password,setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const user = useUser();
    const {token} = useParams();

    useEffect(()=>{
        let timer = null;
        if(user){
            navigate('/')
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    const handlePasswordOnChange = (event) => {
        setPassword(event.target.value);
    }

    const handleConfirmPasswordOnChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        if(password!=confirm_password){
            Swal.fire({
                icon:"error",
                title:"Please make sure both password are same"
            })
            return;
        }
        fetch('/reset_password',{
            method:'post',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+token
            },
            body:JSON.stringify({
                password,
                confirm_password
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    icon:"error",
                    title:data.error
                })
            }
            else{
                Swal.fire({
                    icon:"success",
                    title:data.message
                }).then(
                    navigate('/login')
                )
            }
        }).catch(err=>{
            Swal.fire({
                icon:"error",
                message:err
            })
        })
    }
        
    return (
        <div id="reset-password-section">
            {user!=null?<Navigate to="/"/>:<></>}
            <div id="reset-password-upper-section">
                <VpnKeyIcon/>
                <h1>Set New Password</h1>
                <p>Your new password must be different to previously used password</p>
            </div>
            <form id="reset-password-form" onSubmit={event=>handleSubmit(event)}>
                <span>
                    <label>NEW PASSWORD</label>
                    <input type="password" name="password" onChange={event=>handlePasswordOnChange(event)}/>
                </span>
                <span>
                    <label>CONFIRM NEW PASSWORD</label>
                    <input type="password" name="confirm_password" onChange={event=>handleConfirmPasswordOnChange(event)}/>
                </span>
                <input id="send-button" type="submit" value="RESET PASSWORD"/>
            </form>
        </div>
    )
}


export default ResetPassword;