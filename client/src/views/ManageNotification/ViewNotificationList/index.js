import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './view_notification_list.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { BackSection } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import Pagination from '@mui/material/Pagination';
import { Loading } from '../../../components';

const ViewNotificationList = (props) => {

    const navigate = useNavigate();
    const [notifications,setNotifications] = useState([]);
    const [displayedNotifications,setDisplayNotifications] = useState([]);
    const [page,setPage] = useState(0);
    const [isLoading,setIsLoading] = useState(true);
    const user = useUser();
    const ROW_PER_PAGE = 6;

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

    useEffect(()=>{
        setDisplayedNotification();
    },[page,notifications])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/notification',{
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
                setNotifications(data.notifications);
                setPage(1);
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

    const handlePageOnChange = (event, value) => {
        setPage(value);
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
                        'Content-Type':'application/json',
                        'Authorization':'Bearer'+user.access_token
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

    const setDisplayedNotification = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow =  page * ROW_PER_PAGE;
        if(lastRow>=notifications.length){
            setDisplayNotifications(notifications.slice(firstRow-1));
        }
        setDisplayNotifications(notifications.slice(firstRow-1,lastRow));
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
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
                        {displayedNotifications.map(notification=>{
                            return <tr key={notification._id}>
                                <td className='title'>{notification.title}</td>
                                <td className='description'>{notification.description}</td>
                                <td>{notification.created_on.slice(0,10)}</td>
                                <td>
                                    <button className='button' onClick={()=>handleView(notification._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEdit(notification._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' onClick={()=>handleDelete(notification._id)}><DeleteIcon/>Delete</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <div id="notification-list-pagination">
                    <Pagination count={notifications.length<=ROW_PER_PAGE?1:parseInt(notifications.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
                </div>
            </div>
            </>}            
        </React.Fragment>
    )
}

export default ViewNotificationList;