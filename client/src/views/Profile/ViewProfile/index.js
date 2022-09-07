import React, { useEffect, useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import { ProfileSideNavigation , Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import './view_profile.css';
import Swal from 'sweetalert2';

const ViewProfile = (props) =>{

    const [isEdit,setIsEdit] = useState(false);
    const [isLoading,setIsLoading] = useState(true);
    const [userData,setUserData] = useState({name:"",email:"",phone_number:"",birthdate:"",status:"",identity_no:""});
    const user = useUser();
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
            fetchData();
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/user/'+user.id,{
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
                setUserData(data.user);
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

    const handleNameOnChange = (event) =>{
        setUserData(prev=>({...prev,name:event.target.value}));
    }

    const handleEmailOnChange = (event) =>{
        setUserData(prev=>({...prev,email:event.target.value}));
    }

    const handlePhoneNumberOnChange = (event) =>{
        setUserData(prev=>({...prev,phone_number:event.target.value}));
    }

    const handleBirthDateOnChange = (event) =>{
        setUserData(prev=>({...prev,birthdate:event.target.value}));
    }

    const handleIdentityNoOnChange = (event) =>{
        setUserData(prev=>({...prev,identity_no:event.target.value}));
    }

    const handleImageOnClick = () => {
        imageUploadInput.current.click();
    }

    const handleImageOnChange = (event) => {
        event.preventDefault();
        const setPhotoUploaded=(photoUploaded)=>{
            setUserData(prev=>({...prev,profile_pic:photoUploaded}));
        }
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            setPhotoUploaded(reader.result);
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        imageDisplay.current.src = URL.createObjectURL(event.target.files[0]);
    }

    const toggleEdit = () => {
        setIsEdit(true);
    }

    const toggleCancel = () => {
        setIsEdit(false);
        resetState();
    }

    const resetState = () => {
        fetchData();
    };

    const handleSubmit = () => {
        fetch('/user/'+user.id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                ...userData
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

    return(
        <React.Fragment>
            {isLoading?<Loading/>:<>
                <div id='profile-section'>
                    <ProfileSideNavigation activeIndex={0}/>
                    <div id='profile-content-section'>
                        <div id='profile-left-section'>
                            <input className="hidden" ref={imageUploadInput} type="file" accept="image/*" onChange={event=>handleImageOnChange(event)} disabled={!isEdit}/>
                            <img ref={imageDisplay} src={userData.profile_pic?userData.profile_pic:"data:,"} name="image"/>
                            {isEdit&&<>
                                <p>Recommended Image Size: 256px * 256px</p>
                                <button className='button' onClick={handleImageOnClick}>Upload</button>
                            </>}
                        </div>
                        <div id='profile-right-section'>
                            <span className="full-input">
                                <label >NAME</label>
                                <input type="text" defaultValue={userData.name} name="name" onChange={event=>handleNameOnChange(event)} disabled={!isEdit}/>
                            </span>
                            <span className="full-input">
                                <label >EMAIL</label>
                                <input type="email" defaultValue={userData.email} name="email" onChange={event=>handleEmailOnChange(event)} disabled={!isEdit}/>
                            </span>
                            <span className="full-input">
                                <label >PHONE NUMBER</label>
                                <input type="text" defaultValue={userData.phone_number} name="phone_number" onChange={event=>handlePhoneNumberOnChange(event)} disabled={!isEdit}/>
                            </span>
                            <span className="full-input">
                                <label >BIRTH DATE</label>
                                <input type="date" defaultValue={userData.birthdate.slice(0,10)} name="birth_date" onChange={event=>handleBirthDateOnChange(event)} disabled={!isEdit}/>
                            </span>
                        </div>
                        <div>
                            <span className="full-input">
                                <label >STATUS</label>
                                <input type="text" defaultValue={userData.status} name="status" disabled/>
                            </span>
                            <span className="full-input">
                                <label >ID NO</label>
                                <input type="text" defaultValue={userData.identity_no?userData.identity_no:"-"} name="id__no" onChange={event=>handleIdentityNoOnChange(event)} disabled={!isEdit}/>
                            </span>
                            {isEdit?<div id="save-section">
                            <button onClick={toggleCancel} id="cancel-button">Cancel</button>
                            <button onClick={handleSubmit} id="save-button">Save</button>
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

export default ViewProfile;