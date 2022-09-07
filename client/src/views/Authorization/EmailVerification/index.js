import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import './email_verification.css';
import logo from '../../../assets/img/signup.png'
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';
import { Loading } from '../../../components';

const EmailVerification = (props) => {

    const [isLoading,setIsLoading] = useState(true);
    const [isSuccess,setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();
    const user = useUser();

    useEffect(()=>{
        fetchData();
    })

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/user/status/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                status:"Active"
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    icon: 'error',
                    title: data.error,
                })
            }
            else{
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                }).then(navigate('/login'))
            }
        }).catch(err=>{
            Swal.fire({
                icon: 'error',
                title: err,
            })
        })
    }
        
    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
                {user!=null?<Navigate to="/"/>:<></>}
            </>}
        </React.Fragment>
        
    )
}


export default EmailVerification;