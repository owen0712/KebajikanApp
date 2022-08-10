import React, { useEffect, useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import './view_notification_list.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { BackSection } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ViewNotificationList = (props) => {

    const navigate = useNavigate();
    const [notifications,setNotifications] = useState([]);
    const [pageNumber,setPageNumber] = useState(1);
    const [isLoading,setIsLoading] = useState(true);
    const user = useUser();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/notification',{
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
                setNotifications(data.notifications)
                setIsLoading(false);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const handleCreate = () => {
        navigate('/manage_notification/create');
    }

    const handleView = (id) => {
        navigate('/manage_notification/view/'+id);
    }

    const handleEdit = (id) => {
        navigate('/manage_notification/edit/'+id);
    }

    const handleDelete = (id) =>{
        Swal.fire({
            title: 'Delete Notification',
            text: 'Do you want to delete this charity event?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                fetch('/notification/'+id,{
                    method:'delete',
                    headers:{
                        'Content-Type':'application/json'
                    }
                }).then(res=>res.json()).then(data=>{
                    if(data.error){
                        Swal.fire({
                            title: data.error,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        })
                    }
                    else{
                        console.log(data.message);
                        Swal.fire({
                            title: data.message,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                        fetchData();
                    }
                }).catch(err=>{
                    Swal.fire({
                        title: err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                })
            }
        })
    }

    const handleRedirectBack = () => {
        navigate('/admin');
    }

    return (
        <React.Fragment>
            {user.role!=2?<Navigate to="/"/>:<></>}
            {isLoading?<h1>Loading...</h1>:<>
            <BackSection title="View Notification" onBackButtonClick={handleRedirectBack} previousIsHome={true} createButtonName="Create New Notification" handleButtonCreate={handleCreate}/>
            <div id="#announcement-list-table-section">
                <table>
                    <thead>
                        <tr>
                            <th className='title'>ANNOUNCEMENT</th>
                            <th className='description'>DESCRIPTION</th>
                            <th>DATE CREATED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map(notification=>{
                            return <tr key={notification._id}>
                                <td className='title'>{notification.title}</td>
                                <td className='description'>{notification.description}</td>
                                <td>{notification.created_on.slice(0,10)}</td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleView(notification._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEdit(notification._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' onClick={()=>handleDelete(notification._id)}><DeleteIcon/>Delete</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {/* <div id="charity-event-list-pagination">
                    <ArrowLeftIcon/>
                    <input type="number" defaultValue={pageNumber}/>
                    <p>/{events.length/7}</p>
                    <ArrowRightIcon/>
                </div> */}
            </div>
            </>}            
        </React.Fragment>
    )
}

export default ViewNotificationList;