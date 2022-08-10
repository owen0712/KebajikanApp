import React, { useEffect, useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import './view_announcement_list.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Swal from 'sweetalert2';
import { BackSection, Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ViewAnnouncementList = (props) => {

    const navigate = useNavigate();
    const [announcements,setAnnouncements] = useState([]);
    const [pageNumber,setPageNumber] = useState(1);
    const [isLoading,setIsLoading] = useState(true);
    const user = useUser();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/announcement/list',{
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
                console.log(announcements)
                setAnnouncements(data.announcements)
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
        navigate('/manage_announcement/create');
    }

    const handleView = (id) => {
        navigate('/manage_announcement/view/'+id);
    }

    const handleEdit = (id) => {
        navigate('/manage_announcement/edit/'+id);
    }

    const handleDelete = (id) =>{
        Swal.fire({
            title: 'Delete Announcement',
            text: 'Do you want to delete this announcement?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                fetch('/announcement/'+id,{
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
            {isLoading?<Loading/>:<>
            <BackSection title="View Announcement" onBackButtonClick={handleRedirectBack} previousIsHome={true} createButtonName="Create New Announcement" handleButtonCreate={handleCreate}/>
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
                        {announcements.map(announcement=>{
                            return <tr key={announcement._id}>
                                <td className='title'>{announcement.title}</td>
                                <td className='description'>{announcement.description}</td>
                                <td>{announcement.created_on.slice(0,10)}</td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleView(announcement._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEdit(announcement._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' onClick={()=>handleDelete(announcement._id)}><DeleteIcon/>Delete</button>    
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

export default ViewAnnouncementList;