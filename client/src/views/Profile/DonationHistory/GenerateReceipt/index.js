import React, { useEffect, useState } from 'react'
import './generate_receipt.css';
import BackSection from '../../../../components/BackSection';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../../contexts/UserContext';
import { Loading } from '../../../../components';

const GenerateReceipt = (props) => {

    const [donation,setDonation] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const id = useParams();
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

    const retrieveReceipt = () => {
        fetch('/receipt/'+id.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            }
        }).then(res=>res.blob()).then(data=>{
            if(data.error){
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            }
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(data);
            link.download = `${id.id}-${new Date().toISOString().slice(0,10)}.pdf`;
            link.click();
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const handleButtonOnClick = () => {
        retrieveReceipt();
    }

    const handleRedirectBack = () => {
        navigate('/profile/donation_history');
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection onBackButtonClick={handleRedirectBack} title="View Receipt"/>
            <div id='receipt-section'>
                <table>
                    <tbody>
                        <tr className='title'>
                            <td colSpan={3}>To: {user.name}</td>
                            <td colSpan={2}>Donation Mode: {donation.category}</td>
                        </tr>
                        <tr>
                            <td colSpan={5}>Title: Donation for "{donation.charity_event_id.title}" Event</td>
                        </tr>
                        <tr className='title'>
                            <td>No</td>
                            <td>Description</td>
                            <td>Amount(RM)</td>
                            <td>Quantity</td>
                            <td>Total Payment</td>
                        </tr>
                        {
                            donation.category=="Money"?
                                <tr>
                                    <td>1</td>
                                    <td>Money</td>
                                    <td>{donation.amount}</td>
                                    <td>-</td>
                                    <td>{donation.amount}</td>
                                </tr>
                            :
                            <>
                            {donation.items.map((item,index)=>{
                                return <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.description}</td>
                                    <td>-</td>
                                    <td>{item.quantity}</td>
                                    <td>-</td>
                                </tr>
                            })}
                            </>
                        }
                        <tr>
                            <td className='title' colSpan={4}>Total</td>
                            <td>{donation.category=="Money"?donation.amount:"-"}</td>
                        </tr>
                    </tbody>    
                </table>
            {
                donation.status=="Verified"&&<div id="donation-button-row">
                <button className='button' id="donate-button" onClick={handleButtonOnClick}>Generate Receipt</button>
                </div>
            }
            </div>
            </>}
        </React.Fragment>
    )
}

export default GenerateReceipt;