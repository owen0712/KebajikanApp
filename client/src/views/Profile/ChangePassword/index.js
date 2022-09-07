import React, { useEffect, useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import { ProfileSideNavigation , Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import './change_password.css';
import Swal from 'sweetalert2';

const ChangePassword = (props) =>{

    const [isLoading,setIsLoading] = useState(true);
    const [password,setPassword] = useState({current_password:"",new_password:"",confirm_password:""});
    const user = useUser();
    const navigate = useNavigate();

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            setIsLoading(false);
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    const handlePasswordOnChange = (event) =>{
        setPassword(prev=>({...prev,current_password:event.target.value}));
    }

    const handleNewPasswordOnChange = (event) =>{
        setPassword(prev=>({...prev,new_password:event.target.value}));
    }

    const handleConfirmPasswordOnChange = (event) =>{
        setPassword(prev=>({...prev,confirm_password:event.target.value}));
    }

    const handleSubmit = () => {
        if(password.new_password!==password.confirm_password){
            Swal.fire({
                title: "Please make sure both new password are same",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
        fetch('/password/'+user.id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                ...password
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else{
                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
                navigate('/profile/password');
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    return(
        <React.Fragment>
            {isLoading?<Loading/>:<>
                <div id='password-section'>
                    <ProfileSideNavigation activeIndex={0}/>
                    <div id='password-content-section'>
                        <span className="full-input">
                            <label >CURRENT PASSWORD</label>
                            <input type="password" name="password" onChange={event=>handlePasswordOnChange(event)}/>
                        </span>
                        <span className="full-input">
                            <label >NEW PASSWORD</label>
                            <input type="password" name="new_password" onChange={event=>handleNewPasswordOnChange(event)}/>
                        </span>
                        <span className="full-input">
                            <label >CONFIRM NEW PASSWORD</label>
                            <input type="password" name="confirm_password" onChange={event=>handleConfirmPasswordOnChange(event)}/>
                        </span>
                        <div id='save-section'>
                            <button onClick={handleSubmit} id="save-button">Save</button>
                        </div>
                    </div>
                </div>
            </>}
        </React.Fragment>
    )

}

export default ChangePassword;