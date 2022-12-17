import React, { useEffect, useState, useRef } from 'react';
import {useNavigate, Navigate, useParams} from 'react-router-dom';
import { Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import './complete-user-info.css';
import Swal from 'sweetalert2';

const CompleteUserInfo = (props) =>{

    const [isLoading,setIsLoading] = useState(true);
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone_number,setPhoneNumber] = useState("");
    const [birthdate,setBirthdate] = useState("");
    const [role,setRole] = useState("");
    const [status,setStatus] = useState("");
    const [identity_no,setIdentityNo] = useState("");
    const [profile_pic, setProfilePic] = useState(null);
    const {id} = useParams();
    const user = useUser();
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const navigate = useNavigate();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/user-info/incomplete/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else{
                const userInfo = data.user;
                console.log(userInfo)
                setName(userInfo.name);
                setEmail(userInfo.email);
                setRole(userInfo.role);
                setStatus(userInfo.status);
                setIdentityNo(userInfo.identity_no);
                setProfilePic(userInfo.profile_pic);
                setIsLoading(false);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    const handlePhoneNumberOnChange = (event) =>{
        setPhoneNumber(event.target.value);
    }

    const handleBirthDateOnChange = (event) =>{
        setBirthdate(event.target.value);
    }

    const handleIdentityNoOnChange = (event) =>{
        setIdentityNo(event.target.value);
    }


    const handleSubmit = () => {
        fetch('/user-info/complete/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                birthdate, 
                phone_number,
                identity_no,
                status:"Active"
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
                navigate("/");
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
                {(user!=null || status!="Not Active")?<Navigate to="/"/>:<>
                <div id='user-info-section'>
                    <div id='user-info-content-section'>
                        <div id='user-info-left-section'>
                            <input className="hidden" ref={imageUploadInput} type="file" accept="image/*"/>
                            <img ref={imageDisplay} src={profile_pic?profile_pic:"data:,"} name="image"/>
                        </div>
                        <div id='user-info-right-section'>
                            <span className="full-input">
                                <label >NAME</label>
                                <input type="text" defaultValue={name} name="name" disabled/>
                            </span>
                            <span className="full-input">
                                <label >EMAIL</label>
                                <input type="email" defaultValue={email} name="email" disabled/>
                            </span>
                            <span className="full-input">
                                <label >PHONE NUMBER *</label>
                                <input type="text" defaultValue={phone_number} name="phone_number" onChange={event=>handlePhoneNumberOnChange(event)}/>
                            </span>
                            <span className="full-input">
                                <label >BIRTH DATE *</label>
                                <input type="date" defaultValue={birthdate.slice(0,10)} name="birth_date" onChange={event=>handleBirthDateOnChange(event)} />
                            </span>
                        </div>
                        <div>
                        <span className="full-input">
                                <label >ROLE</label>
                                <input type="text" defaultValue={role} name="role" disabled/>
                            </span>
                            <span className="full-input">
                                <label >STATUS</label>
                                <input type="text" defaultValue={status} name="status" disabled/>
                            </span>
                            <span className="full-input">
                                <label >ID NO</label>
                                <input type="text" defaultValue={identity_no?identity_no:"-"} name="id__no" onChange={event=>handleIdentityNoOnChange(event)}/>
                            </span>
                            <div id="save-section">
                                <button onClick={handleSubmit} id="save-button">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>}</>}
        </React.Fragment>
    )

}

export default CompleteUserInfo;