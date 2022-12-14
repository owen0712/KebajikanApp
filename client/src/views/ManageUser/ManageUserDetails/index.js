import React, { useEffect, useState, useRef } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { BackSection , Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import './manage_user_details.css';
import Swal from 'sweetalert2';


const ManageUserDetails = (props) =>{

    const [isEdit,setIsEdit] = useState(props.isEdit);
    const [isLoading,setIsLoading] = useState(true);
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone_number,setPhoneNumber] = useState("");
    const [birthdate,setBirthdate] = useState("");
    const [role,setRole] = useState("");
    const [status,setStatus] = useState("");
    const [identity_no,setIdentityNo] = useState("");
    const [profile_pic, setProfilePic] = useState(null);
    const user = useUser();
    const {id} = useParams();
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const navigate = useNavigate();

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            if(user.role!=2){
                navigate('/');
            }
            fetchData();
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/user-info/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
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
                setPhoneNumber(userInfo.phone_number);
                setBirthdate(userInfo.birthdate);
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

    const toggleEdit = () => {
        setIsEdit(true);
    }

    const toggleViewOnly = () => {
        setIsEdit(false);
        resetState();
    }

    const resetState = () => {
        fetchData();
    };

    const toggleInactivate = () =>{
        setIsLoading(true);
        Swal.fire({
            title: ' Inactivate User',
            text: 'Do you want to inactivate this user?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                updateStatus("Inactive"); 
                toggleViewOnly();
            }
        })
        toggleViewOnly();
        setIsLoading(false);
    }

    const toggleActivate = () =>{
        setIsLoading(true);
        Swal.fire({
            title: ' Activate User',
            text: 'Do you want to activate this user?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                updateStatus("Active"); 
                toggleViewOnly();
            }
        })
        toggleViewOnly();
        setIsLoading(false);
    }

    const updateStatus = (newStatus) => {
        fetch('/user/status/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                status: newStatus
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
                setIsEdit(false);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    const handleRedirectBack = () => {
        navigate('/manage_user');
    }

    return(
        <React.Fragment>
            <BackSection onBackButtonClick={handleRedirectBack} title={isEdit?"Edit User Details":"View User Details"}/>
            {isLoading?<Loading/>:<>
                <div id='manage-user-details-section'>
                    <div id='manage-user-details-content-section'>
                        <div id='manage-user-details-left-section'>
                            <input className="hidden" ref={imageUploadInput} type="file" accept="image/*" disabled/>
                            <img ref={imageDisplay} src={profile_pic?profile_pic:"data:,"} name="image"/>
                        </div>
                        <div id='manage-user-details-right-section'>
                            <span className="full-input">
                                <label >NAME</label>
                                <input type="text" defaultValue={name} name="name" disabled/>
                            </span>
                            <span className="full-input">
                                <label >EMAIL</label>
                                <input type="email" defaultValue={email} name="email" disabled/>
                            </span>
                            <span className="full-input">
                                <label >PHONE NUMBER</label>
                                <input type="text" defaultValue={phone_number} name="phone_number" disabled/>
                            </span>
                            <span className="full-input">
                                <label >BIRTH DATE</label>
                                <input type="date" defaultValue={birthdate.slice(0,10)} name="birth_date" disabled/>
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
                                <input type="text" defaultValue={identity_no?identity_no:"-"} name="id__no" disabled/>
                            </span>
                            {isEdit?<div id="save-section">
                            {status=="Active"?<button onClick={toggleInactivate} id="inactivate-button">Inactivate</button>:""}
                            {status=="Inactive"?<button onClick={toggleActivate} id="activate-button">Activate</button>:""}
                            <button onClick={toggleViewOnly} id="cancel-button">Cancel</button>
                            </div>:
                            <button onClick={toggleEdit} id="create-button">Edit</button>
                            }
                        </div>
                    </div>
                </div>
            </>}
        </React.Fragment>
    )

}

export default ManageUserDetails;