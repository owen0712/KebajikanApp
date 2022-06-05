import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

    const [firstname,setFirstname]=useState('');
    const [lastname,setLastname]=useState('');
    const [email,setEmail]=useState('');
    const [dob,setDob]=useState(new Date().toISOString().slice(0, 10));
    const [contact,setContact]=useState('');
    const [password,setPassword]=useState('');
    const [college,setCollege]=useState('');
    const [confirmpassword,setConfirmPassword]=useState('');
    const [errorEmail,setErrorEmail]=useState(false);
    const [errorPassword,setErrorPassword]=useState(false);
    const [errorConfirmPassword,setErrorConfirmPassword]=useState(false);
    const [errorCollege,setErrorCollege]=useState(false);
    const [serverMessage,setServerMessage]=useState('');
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const collegeList=["Please select your college","KK1","KK2","KK3","KK4","KK5","KK6","KK7","KK8","KK9","KK10","KK11","KK12","KK13"];
    const renderedCollegeList=collegeList.map(collegeItem=>{
        return (
            <option key={collegeItem} value={collegeItem}>{collegeItem}</option>
        );
    });

    const navigate=useNavigate();

    const checkEmail = (inputValue) =>{
        setEmail(inputValue);
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(inputValue)){
            setErrorEmail(true);
        }else{
            setErrorEmail(false);
        }
    }

    const checkPassword = (inputValue) =>{
        setPassword(inputValue);
        if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(inputValue)){
            setErrorPassword(true);
        }else{
            setErrorPassword(false);
        }
        checkConfirmPassword(confirmpassword);
    }

    const checkConfirmPassword = (inputValue) =>{
        setConfirmPassword(inputValue);
        setErrorConfirmPassword(inputValue!==password);
    }

    const checkCollege = (inputValue) =>{
        setCollege(inputValue);
        setErrorCollege(inputValue==='Please select your college');
    }

    const toggleShowPassword = () =>{
        setShowPassword(!showPassword);
    }

    const toggleShowConfirmPassword = () =>{
        setShowConfirmPassword(!showConfirmPassword);
    }

    const handleSignUp = () =>{
        checkCollege(college);
        if(errorCollege|errorEmail|errorPassword|errorConfirmPassword){
            setServerMessage("Please make sure all data fill in correct format");
            return;
        }

        if(!firstname||!lastname||!email||!dob||!contact||!college||!password){
            setServerMessage("Please fill all data");
            return;
        }

        fetch('/signup',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "firstname":firstname,
                "lastname":lastname,
                "email":email,
                "contact":contact,
                "college":college,
                "dob":dob,
                "password":password
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                setServerMessage(data.error);
            }
            else{
                setServerMessage(data.message);
                navigate('/login');
            }
        }).catch(err=>{
            setServerMessage(err);
        })
    }

    return (
        <div id='signup-form'>
            <h3>Sign Up</h3>
            <small className='error-message'>{serverMessage}</small>
            <input type='text' className='input' placeholder='First Name' value={firstname} onChange={(e)=>{setFirstname(e.target.value)}}/>
            <input type='text' className='input' placeholder='Last Name' value={lastname} onChange={e=>{setLastname(e.target.value)}}/>
            <input type='email' className='input' placeholder='Email' value={email} onChange={e=>{checkEmail(e.target.value)}}/>
            <small className={errorEmail?'error-message':'hidden-message'}>Invalid email</small>
            <input type='date' className='input' value={dob} onChange={e=>{setDob(e.target.value)}}/>
            <input type='text' className='input' placeholder='Contact' value={contact} onChange={e=>{setContact(e.target.value)}}/>
            <select className='input' value={college} onChange={e=>{checkCollege(e.target.value)}}>
                {renderedCollegeList}
            </select>
            <small className={errorCollege?'error-message':'hidden-message'}>Please choose a specific college</small>
            <input type={showPassword?'text':'password'} className='input' placeholder='Password' value={password} onChange={e=>{checkPassword(e.target.value)}}/>
            <small className={errorPassword?'error-message':'hidden-message'}>The password should between 8-15 characters including digits, small letter, capital letter and special symbol</small>
            <div>
                <input type='checkbox' id='show-password' onClick={toggleShowPassword}/>
                <label>Show Password</label>
            </div>
            <input type={showConfirmPassword?'text':'password'} className='input' placeholder='Confirm Password' value={confirmpassword} onChange={e=>{checkConfirmPassword(e.target.value)}}/>
            <small className={errorConfirmPassword?'error-message':'hidden-message'}>Please make sure the passwords are same</small>
            <div>
                <input type='checkbox' id='show-confirm-password' onClick={toggleShowConfirmPassword}></input>
                <label>Show Password</label>
            </div>
            <button className='button' onClick={handleSignUp}>Sign Up</button>
        </div>
    );
}

export default SignUp;