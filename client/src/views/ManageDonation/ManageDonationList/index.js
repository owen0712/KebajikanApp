import React, { useEffect, useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import './manage_donation_list.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VerifiedIcon from '@mui/icons-material/Verified';
import Pagination from '@mui/material/Pagination';
import { Status, BackSection, Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ManageDonationList = (props) => {

    const navigate = useNavigate();
    const [donations,setDonations] = useState([]);
    const [displayedDonations,setDisplayDonations] = useState([]);
    const [page,setPage] = useState(0);
    const [isLoading,setIsLoading] = useState(true);
    const user = useUser();
    const ROW_PER_PAGE = 8;

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            if(user.role==0){
                setIsLoading(true)
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
        setDisplayedDonation();
    },[page,donations])

    const isAdmin = () => {
        if(user){
            return user.role==2;
        }
    }

    const isCharityEventOrganizer = () => {
        if(user){
            return user.role==2||user.charity_event_organizer;
        }
    }

    const fetchData = () =>{
        setIsLoading(true);
        const url = (!isAdmin()&&isCharityEventOrganizer())?
                    '/donation/organizer/'+user.id:
                    '/donation';
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
                setDonations(data.donations);
                setPage(1);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleView = (id) => {
        navigate('/manage_donation/view/'+id);
    }

    const handleVerify = (id) => {
        navigate('/manage_donation/verify/'+id);
    }

    const handlePageOnChange = (event, value) => {
        setPage(value);
    }

    const navigatePrev = () =>{
        navigate('/admin');
    }

    const setDisplayedDonation = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow = page * ROW_PER_PAGE;
        if(lastRow>=donations.length){
            setDisplayDonations(donations.slice(firstRow-1));
        }
        setDisplayDonations(donations.slice(firstRow-1,lastRow));
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection title="Donation" previousIsHome={true} onBackButtonClick={navigatePrev}/>
            <div id="donation-list-table-section">
                <table>
                    <thead>
                        <tr id="donation-list-table-header-row">
                            <th className="event-title">RECORD NAME</th>
                            <th className="category">CATEGORY</th>
                            <th className="donor">DONOR</th>
                            <th className="amount">AMOUNT/QUANTITY</th>
                            <th className="date">DATE CREATED</th>
                            <th className="donation-status">STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            displayedDonations.length==0&&<tr className="no-event" rowSpan={6}>
                                <td colSpan={7}>There is still without any donation record.</td>
                            </tr>
                        }
                        {
                        displayedDonations.map(donation=>{
                            return <tr key={donation._id}>
                                <td className='event-title'>{donation.charity_event_id.title}</td>
                                <td>{donation.category}</td>
                                <td>{donation.donor_id.name}</td>
                                <td>{(donation.category=="Money"?((donation.amount)?("RM"+donation.amount):"N/A"):((donation.items)?(donation.items.length+" Items"):"N/A"))}</td>
                                <td>{donation.created_on.slice(0,10)}</td>
                                <td><Status statusName={donation.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleView(donation._id)}><RemoveRedEyeIcon/>View</button>
                                    <button disabled={(donation.status=="Verified"||donation.status=="Rejected")} className='button' onClick={(donation.status=="Verified"||donation.status=="Rejected")?()=>{}:()=>handleVerify(donation._id)}><VerifiedIcon/>Verify</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {donations.length>0&&<div id="donation-list-pagination">
                    <Pagination count={donations.length<=ROW_PER_PAGE?1:parseInt(donations.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
                </div>}
            </div>
            </>}            
        </React.Fragment>
    )
}

export default ManageDonationList;