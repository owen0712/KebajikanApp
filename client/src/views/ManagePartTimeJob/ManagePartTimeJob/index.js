import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './manage_part_time_job.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Swal from 'sweetalert2';
import { Status, BackSection } from '../../../components';

const ManagePartTimeJob = (props) => {

    const navigate = useNavigate();
    const [events,setEvents] = useState([]);
    const [pageNumber,setPageNumber] = useState(1);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/part_time_job',{
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
        navigate('/manage_part_time_job/create');
    }

    const handleView = (id) => {
        navigate('/manage_part_time_job/view/'+id);
    }

    const handleEdit = (id) => {
        navigate('/manage_part_time_job/edit/'+id);
    }

    const handleDelete = (id) =>{
        Swal.fire({
            title: 'Delete Part-Time Job',
            text: 'Do you want to delete this part-time job?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                console.log(id)
                fetch('/part_time_job/'+id,{
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
                        });
                    }
                    else{
                        Swal.fire({
                            title: data.message,
                            text: 'Successfully delete this part-time job!',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                    }
                    
                }).catch(err=>{
                    Swal.fire({
                        title: err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                })
                window.location.reload();
            }
        })
        
    }

    const navigatePrev = () =>{
        navigate('/admin');
    }

    return (
        <React.Fragment>
            {isLoading?<h1>Loading...</h1>:<>
            <BackSection title="Part-Time Job" previousIsHome={true} createButtonName="Create New Part-Time Job" onBackButtonClick={navigatePrev} handleButtonCreate={handleCreate}/>
            <div id="#part-time-job-list-table-section">
                <table>
                    <thead>
                        <tr id="#part-time-job-list-table-header-row">
                            <th>PART-TIME JOB NAME</th>
                            <th>EMPLOYER</th>
                            <th>STUDENT</th>
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
                                <td>{event.organizer_id.name}</td>
                                <td>{event.allocated_student.length}/{event.required_student}</td>
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
                {/* <div id="part-time-job-list-pagination">
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

export default ManagePartTimeJob;