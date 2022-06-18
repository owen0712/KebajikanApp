import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './view_charity_event.css';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Swal from 'sweetalert2';

const ViewCharityEvent = (props) => {

    const navigate = useNavigate();
    const [events,setEvents] = useState([]);
    const [pageNumber,setPageNumber] = useState(1);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/charity_event',{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setEvents(data.events)
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleCreate = () => {
        navigate('/charity_event/create');
    }

    const handleView = (id) => {
        navigate('/charity_event/view/'+id);
    }

    const handleEdit = (id) => {
        navigate('/charity_event/edit/'+id);
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
                console.log(id)
                fetch('/charity_event/'+id,{
                    method:'delete',
                    headers:{
                        'Content-Type':'application/json'
                    }
                }).then(res=>res.json()).then(data=>{
                    if(data.error){
                        console.log(data.error);
                    }
                    else{
                        console.log(data.message);
                        Swal.fire({
                            title: data.message,
                            text: 'Do you want to delete this charity event?',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                    }
                }).catch(err=>{
                    console.log(err);
                })
            }
        })
    }

    return (
        <React.Fragment>
            {isLoading?<p>The content is loading</p>:<>
            <div id="charity-event-list-upper-part">
                <span id="charity-event-list-back-section">
                    <ArrowBackIcon id="back-icon"/>
                    <HomeIcon/>
                </span>
                <p>Charity Event</p>
                <button className="button" onClick={handleCreate}><AddIcon/>Create New Charity Event</button>
            </div>
            <div id="#charity-event-list-table-section">
                <table>
                    <thead>
                        <tr>
                            <th>CHARITY EVENT NAME</th>
                            <th>ORGANIZER</th>
                            <th>PROGRESS</th>
                            <th>DATE CREATED</th>
                            <th>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        events.map(event=>{
                            return <tr key={event._id}>
                                <td>{event.title}</td>
                                <td>{event.organizer_id}</td>
                                <td>{event.amount}</td>
                                <td>{event.created_on}</td>
                                <td>{event.status}</td>
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

export default ViewCharityEvent;