import React, { useEffect, useState } from 'react'
import './manage_notification_details.css';
import BackSection from '../../../components/BackSection';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const ManageNotificationDetails = (props) => {

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [recipients,setRecipients] = useState([]);
    const [recipientList,setRecipientList] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [isEdit,setIsEdit] = useState(props.isEdit);
    const navigate = useNavigate();
    const {id} = useParams();
    const user = useUser();

    const handleTitleOnChange = (event) => {
        setTitle(event.target.value);
    }

    const handleDescriptionOnChange = (event) => {
        setDescription(event.target.value);
    }

    const handleCheckBoxOnChange = (event,removed_recipient) => {
        if(event.target.checked){
            setRecipients([...recipients,removed_recipient]);
        }
        else{
            setRecipients(recipients.filter(recipient=>{return recipient._id!=removed_recipient._id;}));
        }
    }

    const toggleEdit = () => {
        setIsEdit(true);
    }

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/notification/'+id,{
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
                setTitle(data.notification.title);
                setDescription(data.notification.description);
                setRecipients(data.notification.receiver)
                setIsLoading(false);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
        fetch('/user',{
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
                setRecipientList(data.users);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/notification/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                title,
                description,
                recipients
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
                    setIsEdit(false)
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
        navigate('/manage_notification');
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
            {user.role!=2?<Navigate to="/"/>:<></>}
            <BackSection onBackButtonClick={handleRedirectBack} title={isEdit?"Edit Notification":"View Notification"}/>
                <form id="notification_form" onSubmit={event=>handleSubmit(event)}>
                    <span className="short-input">
                        <label >TITLE</label>
                        <input type="text" name="title" defaultValue={title} onChange={event=>handleTitleOnChange(event)} disabled={!isEdit}/>
                    </span>
                    <span className="long-input">
                        <label >DESCRIPTION</label>
                        <textarea name="description" defaultValue={description} onChange={event=>handleDescriptionOnChange(event)} disabled={!isEdit}/>
                    </span>
                    {isEdit?
                        <span className="long-input">
                        <label >RECEIVER LIST</label>
                        <div id="receipient-list">
                            {
                                isLoading?<h1>Loading...</h1>:
                                recipientList.map(recipient=>{
                                    return <span key={recipient._id} className="long-input">
                                    <label>{recipient.name}</label>
                                    {recipients.filter(e => e.name === recipient.name).length > 0?
                                    <input type="checkbox" onChange={event=>handleCheckBoxOnChange(event,{_id:recipient._id,name:recipient.name})} defaultChecked={true}></input>
                                    :<input type="checkbox" onChange={event=>handleCheckBoxOnChange(event,{_id:recipient._id,name:recipient.name})}></input>
                                    }
                                    </span>
                                })

                                
                            }
                        </div>
                    </span>
                    :
                    <span className="long-input">
                        <label >RECEIVER LIST</label>
                        <div id="receipient-list">
                            {
                                isLoading?<h1>Loading...</h1>:
                                recipients.map(recipient=>{
                                    return <span key={recipient._id} className="long-input">
                                    <label>{recipient.name}</label>
                                    </span>
                                })
                            }
                        </div>
                    </span>}                 
                    {isEdit?<div id="save-section">
                        <button onClick={toggleCancel} id="cancel-button">Cancel</button>
                        <input type="submit" value="Save" id="create-button"/>
                        </div>:
                        <button onClick={toggleEdit} id="create-button">Edit</button>
                    }
                </form>
        </React.Fragment>
    )
}


export default ManageNotificationDetails;