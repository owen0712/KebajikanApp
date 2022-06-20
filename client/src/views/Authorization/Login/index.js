import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './login.css';
import BackSection from '../../../components/BackSection';
import AddIcon from '@mui/icons-material/Add';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const Login = (props) => {

    const [name,setName] = useState([]); 
    const [password,setPassword] = useState(true);
    const navigate = useNavigate();
        
    return (
        <React.Fragment>
            <BackSection/>
            <div id="image">
            
            </div>
            <div id="login-form">

            </div>
        </React.Fragment>
    )
}


export default Login;