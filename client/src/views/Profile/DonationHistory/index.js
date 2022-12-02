import React, { useEffect, useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import './donation_history.css';
import { ProfileSideNavigation, Status, Loading } from '../../../components';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';
import Pagination from '@mui/material/Pagination';

const DonationHistory = (props) =>{
    const navigate = useNavigate();
    const [donations,setDonations] = useState([]);
    const [displayedDonations,setDisplayDonations] = useState([]);
    const [page,setPage] = useState(0);
    const [isLoading,setIsLoading] = useState(false);
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
            fetchData();
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    useEffect(()=>{
        setDisplayedDonation();
    },[page,donations])

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
                setPage(1);
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

    const handleViewReceipt = (id) => {
        navigate('/charity_event/generate_receipt/'+id);
    }

    const handlePageOnChange = (event, value) => {
        setPage(value);
    }

    const setDisplayedDonation = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow =  page * ROW_PER_PAGE;
        if(lastRow>=donations.length){
            setDisplayDonations(donations.slice(firstRow-1));
        }
        setDisplayDonations(donations.slice(firstRow-1,lastRow));
    }

    return(
        <React.Fragment>
            {isLoading?<Loading/>:<div id="donation-history">
                <ProfileSideNavigation activeIndex={3}/>
                <div id="donation-history-content">
                    <table>
                        <thead>
                            <tr>
                                <th className="title">RECORD TITLE</th>
                                <th className="category">CATEGORY</th>
                                <th className="date">DONATION DATE</th>
                                <th className="donation-status">STATUS</th>
                                <th className='button-row'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            displayedDonations.map(donation=>{
                                return <tr key={donation._id}>
                                    <td className="title">{donation.charity_event_id.title}</td>
                                    <td>{donation.category}</td>
                                    <td>{donation.created_on.slice(0,10)}</td>
                                    <td><Status statusName={donation.status}/></td>
                                    <td className='button-row'>
                                        {donation.status=="Pending"&&
                                        <>
                                        <button className='button' onClick={()=>handleViewAppointment(donation.appointment_id)}><RemoveRedEyeIcon/>View</button>
                                        <button className='button' onClick={()=>handleEditAppointment(donation.appointment_id)}><CreateIcon/>Edit</button>   
                                        </>}
                                        {donation.status=="Appointment"&&
                                        <>
                                        <button className='button' onClick={()=>handleViewAppointment(donation.appointment_id)}><RemoveRedEyeIcon/>View</button>
                                        <button className='button' onClick={()=>handleFillItemDonation(donation._id)}><CreateIcon/>Fill</button>   
                                        </>}
                                        {donation.status=="Not Verified"&&
                                        <>
                                        <button className='button' onClick={()=>handleViewDonationHistory(donation._id)}><RemoveRedEyeIcon/>View</button>
                                        <button className='button' onClick={()=>handleEditDonationHistory(donation._id)}><CreateIcon/>Edit</button>   
                                        </>}
                                        {donation.status=="Verified"&&
                                        <>
                                        <button className='button' onClick={()=>handleViewReceipt(donation._id)}><RemoveRedEyeIcon/>View</button>
                                        <button className='button' disabled><CreateIcon/>Edit</button>   
                                        </>}
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <div id="donation-list-pagination">
                        <Pagination count={donations.length<=ROW_PER_PAGE?1:parseInt(donations.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
                    </div>
                </div>
            </div>
            }
        </React.Fragment>
    )
}

export default DonationHistory;