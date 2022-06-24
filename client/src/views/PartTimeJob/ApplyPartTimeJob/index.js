import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './apply_part_time_job.css';
import BackSection from '../../../components/BackSection';
import Dropdown from '../../../components/Dropdown';
import Swal from 'sweetalert2';

const courseOption = [
    "Software Engineering", 
    "Artificial Intelligence", 
    "Computer System and Network", 
    "Information System", 
    "Data Science", 
    "Multimedia"
];

const ApplyPartTimeJob = (props) => {

    const [event,setEvent] = useState([]); 
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();
    const id = useParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [identity_no, setIdentityNo] = useState("");
    const [document,setDocument] = useState({});
    const fileUploadInput = useRef();
    const fileTextDisplay = useRef();

    useEffect(()=>{
        fetchData();
    },[])

    const handleNameOnChange = (event) => {
        setName(event.target.value);
    }

    const handleEmailOnChange = (event) =>{
        setEmail(event.target.value);
    }

    const handleIdentityNoOnChange = (event) => {
        setIdentityNo(event.target.value);
    }

    const handleCourseOnChange = (event) => {
        setCourse(event.target.value);
    }

    const handleTextInputOnClick = () => {
        fileUploadInput.current.click();
    }

    const handleFileOnChange = (event) => {
        const setDocumentUploaded = (documentUploaded) =>{
            setDocument(documentUploaded);
            console.log(documentUploaded);
        }
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            setDocumentUploaded({
                name:event.target.files[0].name,
                content:reader.result
            });
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        fileTextDisplay.current.value = event.target.files[0].name;
    }
    

    const fetchData = () => {
        setIsLoading(true);
        fetch('/part_time_job/'+id.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setEvent(data.event);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Job ID",id.id);
        fetch('/job_application/'+id.id,{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name,
                email,
                identity_no,
                course,
                document
            })
        }).then(res=>res.json()).then(data=>{
            console.log("Data",data);
            if(data.error){
                console.log(data.error);
            }
            else{
                console.log(data.message);
                Swal.fire({
                    icon: 'success',
                    title: 'Job Applied Successfully!',
                    confirmButtonText: 'OK'
                });
                navigatePrev();
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const navigatePrev = () =>{
        navigate('/part_time_job/view');
    }
        
    return (
        <React.Fragment>
            <BackSection onBackButtonClick={navigatePrev} title="Apply Part-Time Job"/>
            {isLoading?"":<>
            <div id="apply-job-layout">
                <div id="apply-job-details-section">
                    <img src={event.photo.content}/>
                    <span>
                        <h2 id="title">{event.title}</h2>
                        <p>Description: {event.description}</p>
                        <p>Allowance: RM{event.allowance}</p>
                        <p>Status: {event.status}</p>
                        <p>Closed Date: {event.closed_date.slice(0,10)}</p>
                    </span>
                </div>
                <form id="apply-job-form" onSubmit={event=>handleSubmit(event)}>
                    <span className="short-input">
                        <label >NAME</label>
                        <input type="text" name="name" onChange={event=>handleNameOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >EMAIL</label>
                        <input type="email" name="email" onChange={event=>handleEmailOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >ID_NO</label>
                        <input type="text" name="identity_no" onChange={event=>handleIdentityNoOnChange(event)}/>
                    </span>
                    <Dropdown
                        optionList={courseOption}
                        label = "Course"
                        value = {course}
                        handleOnChange = {handleCourseOnChange}
                    />
                    <span className="short-input">
                        <label >CURRICULUM VITAE</label>
                        <input className="hidden" ref={fileUploadInput} onChange={event=>handleFileOnChange(event)} type="file" accept=".pdf" name="document"/>
                        <input ref={fileTextDisplay} onClick={handleTextInputOnClick} type="text" defaultValue="No file is chosen"/>
                    </span>
                    <input type="submit" value="SUBMIT" id="submit-button"/>
                </form>
            </div>
            </>}
        </React.Fragment>
    )
}


export default ApplyPartTimeJob;