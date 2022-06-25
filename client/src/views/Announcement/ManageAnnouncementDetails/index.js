import React, { useRef, useState, useEffect } from 'react'
import './view_announcement_details.css';
import BackSection from '../../../components/BackSection';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ViewAnnouncementDetails = (props) => {

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [attachment,setAttachment] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const [isEdit,setIsEdit] = useState(props.isEdit);
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const navigate = useNavigate();
    const {id} = useParams();;

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/announcement/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
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
                const announcement = data.announcement;
                setTitle(announcement.title);
                setDescription(announcement.description);
                setAttachment(announcement.attachment);
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
        const jwt=sessionStorage.getItem("jwt");
        fetch('/announcement/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+jwt
            },
            body:JSON.stringify({
                title,
                description,
                attachment
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
                    icon:"success",
                    title:data.message,
                    confirmButtonText: 'Ok'
                });
                setIsEdit(false);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const handleRedirectBack = () => {
        navigate('/manage_announcement');
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
        
    return (
        <React.Fragment>
            {JSON.parse(sessionStorage.getItem("user")).role!=2?<Navigate to="/"/>:<></>}            
            <BackSection onBackButtonClick={handleRedirectBack} title={isEdit?"Edit Announcement":"View Announcement"}/>
            {isLoading?<h1>Loading...</h1>:<>
            <form id="announcement_form" onSubmit={event=>handleSubmit(event)}>
                <span className="short-input">
                    <label >TITLE</label>
                    <input type="text" name="title" defaultValue={title} onChange={event=>handleTitleOnChange(event)} disabled={!isEdit} />
                </span>
                <span className="long-input">
                    <label >DESCRIPTION</label>
                    <textarea name="description" defaultValue={description} onChange={event=>handleDescriptionOnChange(event)} disabled={!isEdit} />
                </span>                 
                <span className="file-upload">
                    <label >COVER PHOTO</label>
                    <input className="hidden" ref={imageUploadInput} type="file" accept="image/*" onChange={event=>handleImageOnChange(event)}/>
                    <img ref={imageDisplay} src={attachment.content} name="image" onClick={isEdit?handleImageOnClick:()=>{}}/>
                </span>
                {isEdit?<div id="save-section">
                <button onClick={toggleCancel} id="cancel-button">Cancel</button>
                <input type="submit" value="Save" id="create-button"/>
                </div>:
                <button onClick={toggleEdit} id="create-button">Edit</button>
                }
            </form>
            </>
        }
        </React.Fragment>
    )
}


export default ViewAnnouncementDetails;