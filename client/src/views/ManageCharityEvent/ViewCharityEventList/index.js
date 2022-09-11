import React, { useEffect, useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import './view_charity_event_list.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { BackSection, Status, Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ViewCharityEventList = (props) => {

    const navigate = useNavigate();
    const [events,setEvents] = useState([]);
    const [pageNumber,setPageNumber] = useState(1);
    const [isLoading,setIsLoading] = useState(true);
    const user = useUser();

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

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/charity_event/approved',{
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
                setEvents(data.events)
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

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection title="View Charity Event" onBackButtonClick={handleRedirectBack} previousIsHome={true} createButtonName="Create New Charity Event" handleButtonCreate={handleCreate}/>
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
                        events.map(event=>{
                            return <tr key={event._id}>
                                <td className="title">{event.title}</td>
                                <td>{event.organizer_id.name}</td>
                                <td>RM{event.current_amount}/{event.amount}</td>
                                <td>{event.created_on.slice(0,10)}</td>
                                <td><Status statusName={event.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleView(event._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEdit(event._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' onClick={()=>handleDelete(event._id)}><DeleteIcon/>Delete</button>    
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

export default ViewCharityEventList;