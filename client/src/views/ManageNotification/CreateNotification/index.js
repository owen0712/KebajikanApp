import React, { useEffect, useState } from 'react'
import './create_notification.css';
import BackSection from '../../../components/BackSection';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';
import { Loading } from '../../../components';
import Pagination from '@mui/material/Pagination';

const CreateNotification = (props) => {

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [recipients,setRecipients] = useState([]);
    const [recipientList,setRecipientList] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [displayedRecipients,setDisplayRecipients] = useState([]);
    const [page,setPage] = useState(0);
    const navigate = useNavigate();
    const user = useUser();
    const ROW_PER_PAGE = 5;

    const handleTitleOnChange = (event) => {
        setTitle(event.target.value);
    }

    const handleDescriptionOnChange = (event) => {
        setDescription(event.target.value);
    }

    const handleCheckBoxOnChange = (event,id) => {
        if(event.target.checked){
            setRecipients([...recipients,id]);
        }
        else{
            setRecipients(recipients.filter(recipient_id=>{return recipient_id!=id;}));
        }
    }

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            if(user.role==2){
                fetchData();
            }
            else{
                timer = setTimeout(()=>{
                    navigate('/login')
                },5000)
            }
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    useEffect(()=>{
        setDisplayedRecipient();
    },[page,recipientList])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/user',{
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
                setRecipientList(data.users);
                setPage(1);
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
        fetch('/notification',{
            method:'post',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                title,
                description,
                recipients,
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
                    navigate('/manage_notification')
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

    const handlePageOnChange = (event, value) => {
        setPage(value);
    }

    const setDisplayedRecipient = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow =  page * ROW_PER_PAGE;
        if(lastRow>=recipientList.length){
            setDisplayRecipients(recipientList.slice(firstRow-1));
        }
        setDisplayRecipients(recipientList.slice(firstRow-1,lastRow));
    }
        
    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
                <BackSection onBackButtonClick={handleRedirectBack} title="Create Notification"/>
                <form id="notification_form" onSubmit={event=>handleSubmit(event)}>
                    <span className="short-input">
                        <label >TITLE</label>
                        <input type="text" name="title" onChange={event=>handleTitleOnChange(event)}/>
                    </span>
                    <span className="long-input">
                        <label >DESCRIPTION</label>
                        <textarea name="description" onChange={event=>handleDescriptionOnChange(event)}/>
                    </span>
                    <span className="long-input">
                        <label >RECEIVER LIST</label>
                        <div id="receipient-list">
                            {
                                displayedRecipients.map(recipient=>{
                                    return <span key={recipient._id} className="long-input">
                                    <label>{recipient.name}</label>
                                    <input type="checkbox" onChange={event=>handleCheckBoxOnChange(event,recipient._id)} checked={recipients.includes(recipient._id)}></input>
                                    </span>
                                })
                            }
                        </div>
                        <div id="recipient-list-pagination">
                            <Pagination count={recipientList.length<=ROW_PER_PAGE?1:parseInt(recipientList.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
                        </div>
                    </span>                 
                    <input type="submit" value="Create" id="create-button"/>
                </form>
            </>}
            
        </React.Fragment>
    )
}


export default CreateNotification;