import React, { useRef, useState } from 'react'
import './create_announcement.css';
import BackSection from '../../../components/BackSection';
import { useNavigate, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const CreateAnnouncement = (props) => {

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [attachment,setAttachment] = useState(null);
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const navigate = useNavigate();
    const user = useUser();

    const handleTitleOnChange = (event) => {
        setTitle(event.target.value);
    }

    const handleDescriptionOnChange = (event) => {
        setDescription(event.target.value);
    }

    const handleImageOnClick = () => {
        imageUploadInput.current.click();
    }

    const handleImageOnChange = (event) => {
        const setPhotoUploaded=(photoUploaded)=>{
            setAttachment(photoUploaded);
        }
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            setPhotoUploaded({
                name:event.target.files[0].name,
                content:reader.result
            });
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        imageDisplay.current.src = URL.createObjectURL(event.target.files[0]);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/announcement',{
            method:'post',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                title,
                description,
                attachment,
                user_id:user.id
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    icon:"error",
                    title:data.error
                });
            }
            else{
                Swal.fire({
                    icon:"success",
                    title:data.message
                }).then(
                    navigate('/manage_announcement')
                );
            }
        }).catch(err=>{
            Swal.fire({
                icon:"error",
                title:err
            });
        })
    }

    const handleRedirectBack = () => {
        navigate('/manage_announcement');
    }
        
    return (
        <React.Fragment>
            {user.role!=2?<Navigate to="/"/>:<></>}
            <BackSection onBackButtonClick={handleRedirectBack} title="Create Announcement"/>
            <form id="announcement_form" onSubmit={event=>handleSubmit(event)}>
                <span className="short-input">
                    <label >TITLE</label>
                    <input type="text" name="title" onChange={event=>handleTitleOnChange(event)}/>
                </span>
                <span className="long-input">
                    <label >DESCRIPTION</label>
                    <textarea name="description" onChange={event=>handleDescriptionOnChange(event)}/>
                </span>                
                <span className="file-upload">
                    <label >COVER PHOTO</label>
                    <input className="hidden" ref={imageUploadInput} type="file" accept="image/*" onChange={event=>handleImageOnChange(event)}/>
                    <img ref={imageDisplay} src="data:," name="image" onClick={handleImageOnClick}/>
                </span>
                <input type="submit" value="Create" id="create-button"/>
            </form>
        </React.Fragment>
    )
}


export default CreateAnnouncement;