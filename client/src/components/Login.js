import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';

const Login = ({setUserData}) => {

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [serverMessage,setServerMessage]=useState('');
    const [showPassword,setShowPassword]=useState(false);

    const navigate=useNavigate();
    
    const toggleShowPassword = () =>{
        setShowPassword(!showPassword);
    }

    const handleLogin = () =>{
        if(!email||!password){
            setServerMessage('please add all fields');
            return;
        }
        
        fetch('/signin',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                setServerMessage(data.error);
            }
            else{
                setServerMessage(data.message);
                setUserData(data.user);
                navigate('/');
            }
        }).catch(err=>{
            setServerMessage(err);
        })
    }

    return (
        <div id='login-section'>
            <h3>Login</h3>
            <small className='error-message'>{serverMessage}</small>
            <div id='email-section'>
                <i className="fa-solid fa-user"><input type='text' className='input' placeholder='email' value={email} onChange={e=>{setEmail(e.target.value)}}/></i>
            </div>
            <div id='password-section'>
                <i className="fa-solid fa-lock"><input type={showPassword?'text':'password'} className='input' placeholder='Password' value={password} onChange={e=>{setPassword(e.target.value)}}/></i>
            </div>
            <div>
                <input type='checkbox' id='show-password' onClick={toggleShowPassword}/>
                <label>Show Password</label>
            </div>
            <button className='button' onClick={handleLogin}>Login</button>
            <Link to='/signup'>Register Now!</Link>
            <Link to='/'>Forgot Password?</Link>
        </div>
    );
}

export default Login;