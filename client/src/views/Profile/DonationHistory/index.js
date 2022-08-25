import React, { useEffect, useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import './donation_history.css';
import { ProfileSideNavigation, Status, Loading } from '../../../components';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const DonationHistory = (props) =>{
    const navigate = useNavigate();
    const [donations,setDonations] = useState([]);
    const [pageNumber,setPageNumber] = useState(1);
    const [isLoading,setIsLoading] = useState(false);
    const user = useUser();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData=()=>{
        setIsLoading(true);
        fetch('/donation/user/'+user.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    icon:"error",
                    title:data.error
                });
            }
            else{
                setDonations(data.donations);
                setIsLoading(false);
            }
        }).catch(err=>{
            Swal.fire({
                icon:"error",
                title:err
            });
        })
    }

    const handleViewAppointment = (id) => {
        navigate('/charity_event/appointment/view/'+id);
    }
    
    const handleEditAppointment = (id) => {
        navigate('/charity_event/appointment/edit/'+id);
    }

    const handleViewDonationHistory = (id) => {
        navigate('/charity_event/donate_item/view/'+id);
    }
    
    const handleEditDonationHistory = (id) => {
        navigate('/charity_event/donate_item/edit/'+id);
    }

    const handleFillItemDonation = (id) => {
        navigate('/charity_event/donate_item/fill/'+id);
    }

    return(
        <React.Fragment>
            {user==null?<Navigate to="/login"/>:<></>}
            {isLoading?<Loading/>:""}
            <div id="donation-history">
                <ProfileSideNavigation activeIndex={3}/>
                <table>
                    <thead>
                        <tr>
                            <th>RECORD TITLE</th>
                            <th>CATEGORY</th>
                            <th>DONATION DATE</th>
                            <th>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        donations.map(donation=>{
                            return <tr key={donation._id}>
                                <td className="title">{donation.charity_event_id.title}</td>
                                <td>{donation.category}</td>
                                <td>{donation.created_on.slice(0,10)}</td>
                                <td><Status statusName={donation.status}/></td>
                                <td className='button-row'>
                                    {donation.status=="Pending"?
                                    <>
                                    <button className='button' onClick={()=>handleViewAppointment(donation.appointment_id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEditAppointment(donation.appointment_id)}><CreateIcon/>Edit</button>   
                                    </>
                                    :""
                                    }
                                    {donation.status=="Appointment"?
                                    <>
                                    <button className='button' onClick={()=>handleViewAppointment(donation.appointment_id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleFillItemDonation(donation._id)}><CreateIcon/>Fill</button>   
                                    </>
                                    :""
                                    }
                                    {donation.status=="Not Verified"?
                                    <>
                                    <button className='button' onClick={()=>handleViewDonationHistory(donation._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEditDonationHistory(donation._id)}><CreateIcon/>Edit</button>   
                                    </>
                                    :""
                                    }
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
}

export default DonationHistory;