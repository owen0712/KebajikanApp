import React, { useEffect, useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import './view_charity_event_list.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { BackSection, Status, Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import Pagination from '@mui/material/Pagination';

const ViewCharityEventList = (props) => {

    const navigate = useNavigate();
    const [events,setEvents] = useState([]);
    const [displayedEvents,setDisplayEvents] = useState([]);
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
            if(user.role!=2&&!user.charity_event_organizer&&!user.part_time_job_organizer){
                timer = setTimeout(()=>{
                    navigate('/login')
                },5000)
            }
            else{
                fetchData();
            }
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    useEffect(()=>{
        setDisplayedEvent();
    },[page,events])

    const fetchData = () =>{
        setIsLoading(true);
        const url = user.role==2?'/charity_event/approved':'/charity_event/organizer/approved/'+user.id;
        fetch(url,{
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
                setEvents(data.events);
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

    const handleCreate = () => {
        navigate('/manage_charity_event/create');
    }

    const handleView = (id) => {
        navigate('/manage_charity_event/view/'+id);
    }

    const handleEdit = (id) => {
        navigate('/manage_charity_event/edit/'+id);
    }

    const handlePageOnChange = (event, value) => {
        setPage(value);
    }

    const handleDelete = (id) =>{
        Swal.fire({
            title: 'Delete Charity Event',
            text: 'Do you want to delete this charity event?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                fetch('/charity_event/'+id,{
                    method:'delete',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':"Bearer"+user.access_token
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

    const setDisplayedEvent = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow =  page * ROW_PER_PAGE;
        if(lastRow>=events.length){
            setDisplayEvents(events.slice(firstRow-1));
        }
        setDisplayEvents(events.slice(firstRow-1,lastRow));
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection title="View Charity Event" onBackButtonClick={handleRedirectBack} previousIsHome={true} createButtonName={user.role==2?"Create New Charity Event":""} handleButtonCreate={user.role==2?handleCreate:""}/>
            <div id="#charity-event-list-table-section">
                <table>
                    <thead>
                        <tr>
                            <th className="title">CHARITY EVENT NAME</th>
                            <th className="organizer">ORGANIZER</th>
                            <th className="progress">PROGRESS</th>
                            <th className="date">DATE CREATED</th>
                            <th className="event-status">STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            events.length==0&&<tr className="no-event" rowSpan={6}>
                                <td colSpan={6}>No events exists. Please create new event now!</td>
                            </tr>
                        }
                        {
                        displayedEvents.map(event=>{
                            return <tr key={event._id}>
                                <td className="title">{event.title}</td>
                                <td>{event.organizer_id.name}</td>
                                <td>RM{event.current_amount}/{event.amount}</td>
                                <td>{event.created_on.slice(0,10)}</td>
                                <td><Status statusName={event.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleView(event._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEdit(event._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' onClick={()=>handleDelete(event._id)} disabled={event.status!="Not Started"}><DeleteIcon/>Delete</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {events.length>0&&<div id="event-list-pagination">
                    <Pagination count={events.length<=ROW_PER_PAGE?1:parseInt(events.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
                </div>}
            </div>
            </>}            
        </React.Fragment>
    )
}

export default ViewCharityEventList;