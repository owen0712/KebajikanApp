import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './view_part_time_job.css';
import AddIcon from '@mui/icons-material/Add';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Loading } from '../../../components';
import Pagination from '@mui/material/Pagination';

const ViewPartTimeJob = (props) => {

    const navigate = useNavigate();
    const [jobs,setJobs] = useState([]);
    const [displayedJobs,setDisplayJobs] = useState([]);
    const [page,setPage] = useState(0);
    const [isLoading,setIsLoading] = useState(false);
    const ROW_PER_PAGE = 6;

    useEffect(()=>{
        fetchData();
    },[])

    useEffect(()=>{
        setDisplayedJobs();
    },[page,jobs])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/part_time_job/available',{
            method:'get',
            headers:{
                'Content-Type':'application/json'
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

    const handleApply = (id) => {
        navigate('/part_time_job/apply/'+id);
    }

    const handleView = (id) => {
        navigate('/part_time_job/view/'+id);
    }

    const handleProposeJob = () => {
        navigate('/part_time_job/create');
    }

    const handlePageOnChange = (event, value) => {
        setPage(value);
    }

    const setDisplayedJobs = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow =  page * ROW_PER_PAGE;
        if(lastRow>=jobs.length){
            setDisplayJobs(jobs.slice(firstRow-1));
        }
        setDisplayJobs(jobs.slice(firstRow-1,lastRow));
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <div id="carousel">
                <ArrowLeftIcon/>
                {
                    jobs.slice(0,1).map(data=>{
                        return(
                            <div key={data._id} className="carousel-item">
                                <img src={data.photo.content} onClick={()=>handleView(data._id)}/>
                                <span>
                                    <h1 onClick={()=>handleView(data._id)}>{jobs[0].title}</h1>
                                    <p onClick={()=>handleView(data._id)}>Description: {data.description}</p>
                                    <p onClick={()=>handleView(data._id)}>Allowance: {data.allowance}</p>
                                    <button onClick={()=>handleApply(data._id)} className="apply-button">Apply</button>
                                </span>
                            </div>
                        )
                    })
                }
                <ArrowRightIcon/>
            </div>
            <div id="title-section">
                <p>Part-Time Job</p>
                <button onClick={handleProposeJob}><AddIcon/>Propose New Part-Time Job</button>
            </div>
            <div id="job-list">
                {displayedJobs.map(job=>{
                return(
                <Card key={job._id} className="job-card">
                    <CardMedia
                        component="img"
                        alt={job.title}
                        height="140"
                        src={job.photo.content}
                        onClick={()=>handleView(job._id)}
                    />
                    <CardContent onClick={()=>handleView(job._id)} className="job-content">
                        <p className="job-title">
                            {job.title}
                        </p>
                        <p className="job-description">
                            Description: {job.description}
                        </p>
                        <p className="job-description">
                            Allowance: RM {job.allowance}
                        </p>
                    </CardContent>
                    <CardActions className="action-section">
                        <button onClick={()=>handleApply(job._id)} className="apply-button">Apply</button>
                    </CardActions>
                </Card>)
                })}
            </div>
            <div id="jobs-list-pagination">
                <Pagination count={jobs.length<=ROW_PER_PAGE?1:parseInt(jobs.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
            </div>
            </>}            
        </React.Fragment>
    )
}

export default ViewPartTimeJob;