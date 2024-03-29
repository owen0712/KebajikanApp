import React, { useEffect, useState } from 'react';
import {useNavigate,} from 'react-router-dom';
import './view_announcement_list.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { BackSection, Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import Pagination from '@mui/material/Pagination';

const ViewAnnouncementList = (props) => {

    const navigate = useNavigate();
    const [announcements,setAnnouncements] = useState([]);
    const [displayedAnnouncements,setDisplayAnnouncements] = useState([]);
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
        setDisplayedAnnouncement();
    },[page,announcements])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/announcement/list',{
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
                setAnnouncements(data.announcements);
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
        navigate('/manage_announcement/create');
    }

    const handleView = (id) => {
        navigate('/manage_announcement/view/'+id);
    }

    const handleEdit = (id) => {
        navigate('/manage_announcement/edit/'+id);
    }

    const handlePageOnChange = (event, value) => {
        setPage(value);
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

    const setDisplayedAnnouncement = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow =  page * ROW_PER_PAGE;
        if(lastRow>=announcements.length){
            setDisplayAnnouncements(announcements.slice(firstRow-1));
        }
        setDisplayAnnouncements(announcements.slice(firstRow-1,lastRow));
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection title="View Announcement" onBackButtonClick={handleRedirectBack} previousIsHome={true} createButtonName="Create New Announcement" handleButtonCreate={handleCreate}/>
            <div id="announcement-list-table-section">
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
                        {displayedAnnouncements.map(announcement=>{
                            return <tr key={announcement._id}>
                                <td className='title'>{announcement.title}</td>
                                <td className='description'>{announcement.description}</td>
                                <td>{announcement.created_on.slice(0,10)}</td>
                                <td>
                                    <button className='button' onClick={()=>handleView(announcement._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEdit(announcement._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' onClick={()=>handleDelete(announcement._id)}><DeleteIcon/>Delete</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <div id="announcement-list-pagination">
                    <Pagination count={announcements.length<=ROW_PER_PAGE?1:parseInt(announcements.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
                </div>
            </div>
            </>}            
        </React.Fragment>
    )
}

export default ViewAnnouncementList;