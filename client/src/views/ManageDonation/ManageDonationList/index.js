import React, { useEffect, useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import './manage_donation_list.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Swal from 'sweetalert2';
import { Status, BackSection, Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ManageDonationList = (props) => {

    const navigate = useNavigate();
    const [donations,setDonations] = useState([]);
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
        fetch('/donation',{
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
                setDonations(data.donations)
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

    const navigatePrev = () =>{
        navigate('/admin');
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
                        donations.map(donation=>{
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
                {/* <div id="donation-list-pagination">
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

export default ManageDonationList;