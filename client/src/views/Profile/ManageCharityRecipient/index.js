import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './manage_charity_recipient.css';
import Swal from 'sweetalert2';
import { ProfileSideNavigation, Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import CharityEventRecipientDetails from './CharityEventRecipientDetails';
import Pagination from '@mui/material/Pagination';

const ManageCharityEventRecipient = (props) => {

    const [isLoading,setIsLoading] = useState(true);
    const [applications,setApplications] = useState([]);
    const [application,setApplication] = useState(null);
    const [page,setPage] = useState(0);
    const navigate = useNavigate();
    const user = useUser();

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            fetchData();
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    useEffect(()=>{
        setDisplayedApplication();
    },[page,applications])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/charity_application/approved/'+user.id,{
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
                setApplications(data.applications);
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
    
    const handlePageOnChange = (event, value) => {
        setPage(value);
    }

    const setDisplayedApplication = () =>{
        setApplication(applications[page-1]);
    }
        
    return (
        <React.Fragment>
            <div id='charity-recipient-section'>
            <ProfileSideNavigation activeIndex={5}/>
            {isLoading?<Loading/>:<div id='charity-recipient-details'>
                <CharityEventRecipientDetails application={application}/>
                <div id="charity-recipient-pagination">
                    <Pagination count={applications?applications.length:0} page={page} onChange={handlePageOnChange} />
                </div>
            </div>}
            </div>
        </React.Fragment>
        )
    }


export default ManageCharityEventRecipient;