import React, { useEffect, useState } from 'react'
import './money_donation_result.css';
import BackSection from '../../../components/BackSection';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';
import { Loading } from '../../../components';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const MoneyDonationResult = (props) => {

    const [donation,setDonation] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const isSuccess = props.isSuccess;
    const id = useParams();
    const navigate = useNavigate();
    const user = useUser();

    useEffect(()=>{
        if(user==null){
            return;
        }
        updateData();
        fetchData();
    },[])

    useEffect(()=>{
        if(user==null){
            return;
        }
        updateData();
        fetchData();
    },[user])

    const updateData = () => {
        setIsLoading(true);
        const status = isSuccess?"Verified":"Rejected";
        fetch('/donation/status/'+id.id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                status
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
                return;
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const fetchData = () => {
        fetch('/donation/'+id.id,{
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
                })
            }
            else{
                setDonation(data.donation);
                setIsLoading(false);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const handleGenerateReceiptOnClick = () => {
        navigate('/charity_event/generate_receipt/'+donation._id);
    }

    const handleDonateAgainOnClick = () => {
        navigate('/charity_event/donate_money/'+donation.charity_event_id._id);
    }

    const handleRedirectBack = () => {
        navigate('/charity_event/view/'+donation.charity_event_id._id);
    }

    return (
        <React.Fragment>
            {/* {user==null?<Navigate to="/login"/>:<></>} */}
            {isLoading?<Loading/>:<>
            <BackSection onBackButtonClick={handleRedirectBack} title={isSuccess?"Successful Money Donation":"Failed Money Donation"}/>
                {isSuccess?<div className='success'>
                    <h1 className='success'>Thank You!</h1>
                    <CheckCircleOutlineIcon/>
                    <p>RM {donation.amount}</p>
                    <p>Your donation was successful!</p>
                    <p>You may view the record in Donation History section through Profile</p>
                </div>
                :<div className='fail'>
                    <h1 className='fail'>Sorry!</h1>
                    <HighlightOffIcon/>
                    <p>RM {donation.amount}</p>
                    <p>Your Donation Was Unsuccessful!</p>
                </div>}
                <div id="donation-button-row">
                {isSuccess?
                <button className='button' id="generate-receipt-button">Generate Receipt</button>
                :<></>
                }
                <button className='button' id="donate-button" onClick={handleDonateAgainOnClick}>Donate Again</button>
                </div>
            </>}
        </React.Fragment>
    )
}

export default MoneyDonationResult;