import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './view-job-application.css';
import { BackSection, Dropdown, Loading } from '../../../../components';
import Swal from 'sweetalert2';
import { useUser } from '../../../../contexts/UserContext';

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
    const [jobTitle,setJobTitle] = useState(""); 
    const [isLoading,setIsLoading] = useState(true);
    const [isSubmitLoading,setIsSubmitLoading] = useState(false);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [identity_no, setIdentityNo] = useState("");
    const [documents,setDocuments] = useState({});
    const [status,setStatus] = useState(""); 
    const [isEdit,setIsEdit] = useState(props.isEdit);
    const fileUploadInput = useRef();
    const fileTextDisplay = useRef();
    const job_id = useParams();
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

    const onDownloadDocuments = () => {
        const linkSource = documents.content;
        const downloadLink = document.createElement("a");
        const fileName = documents.name;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const handleFileOnChange = (event) => {
        const setDocumentUploaded = (documentUploaded) =>{
            setDocuments(documentUploaded);
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
        fetch('/job_application/view/'+job_id.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                const event = data.event;
                setName(event.name);
                setEvent(event.job_id);
                setJobTitle(event.job_id.title);
                setEmail(event.email);
                setIdentityNo(event.identity_no);
                setCourse(event.course);
                setDocuments(event.document);
                setStatus(event.status);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleSave = (e) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        fetch('/job_application/'+job_id.id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                name,
                email,
                identity_no,
                course,
                document:documents
            })
        }).then(res=>res.json()).then(data=>{
            console.log("Data",data);
            setIsSubmitLoading(false);
            if(data.error){
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else{
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully Updated!',
                    confirmButtonText: 'OK'
                });
                toggleCancel();
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
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
    }

    const toggleCancel = () => {
        setIsEdit(false);
        resetState();
    }
        
    return (
        <React.Fragment>
            <BackSection onBackButtonClick={navigatePrev} title={"View Job Application: "+jobTitle}/>
            {isSubmitLoading?<Loading/>:<></>}
            {isLoading?<Loading/>:<>
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
                        <input readOnly={!isEdit} ref={fileTextDisplay} onClick={isEdit?handleTextInputOnClick:onDownloadDocuments} type="text" defaultValue={documents.name}/>
                    </span>
                    <span className="short-input">
                        <label >STATUS</label>
                        <input disabled type="text" name="status" defaultValue={status} />
                    </span>
                    {isEdit?
                    <div id="save-section">
                        <button onClick={toggleCancel} id="cancel-button">Cancel</button>
                        <input type="submit" value="Save" id="save-button"/>
                    </div>:
                    <button disabled={(status!="Pending")} onClick={(status!="Pending")?()=>{}:toggleEdit} id="create-button">Edit</button>}
                </form>
            </div>
            </>}
        </React.Fragment>
    )
}


export default ViewJobApplication;