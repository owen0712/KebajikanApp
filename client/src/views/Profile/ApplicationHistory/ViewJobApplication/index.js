import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './view-job-application.css';
import BackSection from '../../../../components/BackSection';
import Dropdown from '../../../../components/Dropdown';
import Swal from 'sweetalert2';

const courseOption = [
    "Software Engineering", 
    "Artificial Intelligence", 
    "Computer System and Network", 
    "Information System", 
    "Data Science", 
    "Multimedia"
];

const ViewJobApplication = (props) => {

    const [event,setEvent] = useState([]); 
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [identity_no, setIdentityNo] = useState("");
    const [document,setDocument] = useState({});
    const [isEdit,setIsEdit] = useState(props.isEdit);
    const fileUploadInput = useRef();
    const fileTextDisplay = useRef();
    const id = useParams();

    useEffect(()=>{
        fetchData();
        // fetchJobData();
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
        fetch('/job_application/view/'+id.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                console.log("job-application",data.event)
                const event = data.event;
                setName(event.name);
                setEvent(event.job_id);
                setEmail(event.email);
                setIdentityNo(event.identity_no);
                setCourse(event.course);
                setDocument(event.document);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleSave = (e) => {
        e.preventDefault();
        fetch('/job_application/'+id.id,{
            method:'put',
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
        navigate('/profile/application_history');
    }

    const resetState = () => {
        fetchData();
    };

    const toggleEdit = () => {
        setIsEdit(true);
        console.log(isEdit);
    }

    const toggleCancel = () => {
        setIsEdit(false);
        resetState();
        console.log(isEdit);
    }
        
    return (
        <React.Fragment>
            <BackSection onBackButtonClick={navigatePrev} title="View Part-Time Job Application"/>
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
                <form id="apply-job-form" onSubmit={e=>handleSave(e)}>
                    <span className="short-input">
                        <label >NAME</label>
                        <input disabled={!isEdit} value={name} type="text" name="name" onChange={event=>handleNameOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >EMAIL</label>
                        <input disabled={!isEdit} value={email} type="email" name="email" onChange={event=>handleEmailOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >ID_NO</label>
                        <input disabled={!isEdit} value={identity_no} type="text" name="identity_no" onChange={event=>handleIdentityNoOnChange(event)}/>
                    </span>
                    <Dropdown isDisabled={!isEdit}
                        optionList={courseOption}
                        label = "Course"
                        value = {course}
                        handleOnChange = {handleCourseOnChange}
                    />
                    <span className="short-input">
                        <label >CURRICULUM VITAE</label>
                        <input className="hidden" ref={fileUploadInput} onChange={event=>handleFileOnChange(event)} type="file" accept=".pdf" name="document"/>
                        <input disabled={!isEdit} ref={fileTextDisplay} onClick={isEdit?handleTextInputOnClick:()=>{}} type="text" defaultValue={document.name}/>
                    </span>
                    {isEdit?<div id="save-section"><button onClick={toggleCancel} id="cancel-button">Cancel</button><input type="submit" value="Save" id="save-button"/></div>:<button onClick={toggleEdit} id="create-button">Edit</button>}
                </form>
            </div>
            </>}
        </React.Fragment>
    )
}


export default ViewJobApplication;