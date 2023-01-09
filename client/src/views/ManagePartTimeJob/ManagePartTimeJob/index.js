import React, { useEffect, useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import './manage_part_time_job.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';
import Swal from 'sweetalert2';
import { Status, BackSection, Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ManagePartTimeJob = (props) => {

    const navigate = useNavigate();
    const [jobs,setJobs] = useState([]);
    const [displayedJobs,setDisplayJobs] = useState([]);
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
            if(user.role!=2&&!user.part_time_job_organizer){
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
        setDisplayedJob();
    },[page,jobs])

    const fetchData = () =>{
        setIsLoading(true);
        const url = user.role==2?'/part_time_job':'/part_time_job/organizer/available/'+user.id;
        fetch(url,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setJobs(data.events);
                setPage(1);
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

    const handlePageOnChange = (event, value) => {
        setPage(value);
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
                        'Content-Type':'application/json',
                        'Authorization':"Bearer"+user.access_token
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
                        fetchData();
                    }
                    
                }).catch(err=>{
                    Swal.fire({
                        title: err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                })
            }
        })
        
    }

    const navigatePrev = () =>{
        navigate('/admin');
    }

    const setDisplayedJob = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow = page * ROW_PER_PAGE;
        if(lastRow>=jobs.length){
            setDisplayJobs(jobs.slice(firstRow-1));
        }
        setDisplayJobs(jobs.slice(firstRow-1,lastRow));
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection title="Part-Time Job" previousIsHome={true} createButtonName="Create New Part-Time Job" onBackButtonClick={navigatePrev} handleButtonCreate={handleCreate}/>
            <div id="part-time-job-list-table-section">
                <table>
                    <thead>
                        <tr id="part-time-job-list-table-header-row">
                            <th className="title">PART-TIME JOB NAME</th>
                            <th className="employer">EMPLOYER</th>
                            <th className="student-required">STUDENT</th>
                            <th className="date">DATE CREATED</th>
                            <th className="job-status">STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            jobs.length==0&&<tr className="no-event" rowSpan={6}>
                                <td colSpan={6}>No part-time job exists. Please create new part-time job now!</td>
                            </tr>
                        }
                        {
                        displayedJobs.map(job=>{
                            return <tr key={job._id}>
                                <td className='title'>{job.title}</td>
                                <td>{job.organizer_id.name}</td>
                                <td>{job.allocated_student.length}/{job.required_student}</td>
                                <td>{job.created_on.slice(0,10)}</td>
                                <td><Status statusName={job.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleView(job._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEdit(job._id)}><CreateIcon/>Edit</button>
                                    <button disabled={job.status=="Closed"} className='danger-button' onClick={(job.status=="Closed")?()=>{}:()=>handleDelete(job._id)}><DeleteIcon/>Delete</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {jobs.length>0&&<div id="job-list-pagination">
                    <Pagination count={jobs.length<=ROW_PER_PAGE?1:parseInt(jobs.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
                </div>}
            </div>
            </>}            
        </React.Fragment>
    )
}

export default ManagePartTimeJob;