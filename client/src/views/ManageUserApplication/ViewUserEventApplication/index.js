import React, { useRef, useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import './view-user-event-application.css';
import {Loading, BackSection} from '../../../components';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const ViewUserEventApplication = (props) => {

    const [name,setName] = useState("");
    const [phone_number,setPhoneNumber] = useState("");
    const [identity_no,setIdentityNo] = useState("");
    const [email,setEmail] = useState("");
    const [ic_no,setIcNo] = useState("");
    const [marital_status,setMaritalStatus] = useState(null);
    const [current_address,setCurrentAddress] = useState(null);
    const [permanent_address,setPermanentAddress] = useState(null);
    const [program,setProgram] = useState("");
    const [department,setDepartment] = useState("");
    const [year_of_study,setYearOfStudy] = useState(1);
    const [semester,setSemester] = useState(1);
    const [father_occ,setFatherOcc] = useState("");
    const [mother_occ,setMotherOcc] = useState("");
    const [father_income,setFatherIncome] = useState(0);
    const [mother_income,setMotherIncome] = useState(0);
    const [total_income,setTotalIncome] = useState(0);
    const [no_sibling,setSiblingNo] = useState(0);
    const [no_dependent,setDependentNo] = useState(0);
    const [document,setDocument] = useState(null);
    const [photo,setPhoto] = useState(null);
    const [isAgree,setIsAgree] = useState(false);
    const [event_name,setEventName] = useState(""); 
    const [isLoading,setIsLoading] = useState(true);
    const [isSubmitLoading,setIsSubmitLoading] = useState(false);
    const [isVerify,setIsVerify] = useState(props.isVerify);
    const id = useParams();
    const navigate = useNavigate();
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const fileUploadInput = useRef();
    const fileTextDisplay = useRef();
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
    },[])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/charity_application/view/'+id.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                // 'Authorization':'Bearer'+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                const event = data.event;
                setName(event.name);
                setPhoneNumber(event.phone_number);
                setIdentityNo(event.identity_no);
                setEmail(event.email);
                setIcNo(event.ic_no);
                setMaritalStatus(event.marital_status);
                setCurrentAddress(event.current_address);
                setPermanentAddress(event.permanent_address);
                setProgram(event.program);
                setDepartment(event.department);
                setYearOfStudy(event.year_of_study);
                setSemester(event.semester);
                setFatherOcc(event.father_occ);
                setMotherOcc(event.mother_occ);
                setFatherIncome(event.father_income);
                setMotherIncome(event.mother_income);
                setTotalIncome(event.total_income);
                setSiblingNo(event.no_sibling);
                setDependentNo(event.no_dependent);
                setDocument(event.document);
                setPhoto(event.photo);
                setEventName(event.event_id.title);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }


    const handleSave = (event) => {
        event.preventDefault();
        setIsSubmitLoading(true);
        fetch('/charity_application/'+id.id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                name,
                phone_number,
                identity_no,
                email,
                ic_no,
                marital_status,
                current_address,
                permanent_address,
                program,
                department,
                year_of_study,
                semester,
                father_occ,
                mother_occ,
                father_income,
                mother_income,
                total_income,
                no_sibling,
                no_dependent,
                document,
                photo
            })
        }).then(res=>res.json()).then(data=>{
            setIsSubmitLoading(false);
            if(data.error){
                console.log(data.error);
            }
            else{
                console.log(data.message);
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully Updated!',
                    confirmButtonText: 'OK'
                });
                toggleViewOnly();
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleTextInputOnClick = () => {
        fileUploadInput.current.click();
    }

    const navigatePrev = () =>{
        navigate('/manage_user_application');
    }

    const resetState = () => {
        fetchData();
    };

    const toggleVerify = () => {
        setIsVerify(true);
    }

    const toggleApprove = (e) => {
        e.preventDefault();
        console.log("Approve");
    }

    const toggleReject = (e) => {
        e.preventDefault();
        console.log("Reject");
    }

    const toggleViewOnly = () => {
        setIsVerify(false);
        resetState();
    }
        
    return (
        <React.Fragment>
            <BackSection onBackButtonClick={navigatePrev} title={"View "+event_name+"  Application Form"}/>
            {isSubmitLoading?<Loading/>:<></>}
            {isLoading?<Loading/>:<>
            <form id="application-form">
                <p className='section-header'>APPLICATION DETAILS</p>
                <div id="apply-form-upper-part">
                    <span className="file-upload">
                        <input disabled className="hidden" ref={imageUploadInput} type="file" accept="image/*" />
                        <img ref={imageDisplay} src={photo.content} name="image" />
                    </span>
                    <div id="apply-form-right-content">
                        <span className="full-input">
                            <label >NAME</label>
                            <input disabled value={name} type="text" name="name" />
                        </span>
                        <span className="full-input">
                            <label >PHONE NUMBER</label>
                            <input disabled value={phone_number} type="text" name="phone_number" />
                        </span>
                        <span className="full-input">
                            <label >MATRIC NO</label>
                            <input disabled value={identity_no} type="text" name="identity_no" />
                        </span>
                        <span className="full-input">
                            <label >EMAIL</label>
                            <input disabled value={email} type="email" name="email" />
                        </span>
                    </div>
                </div>
                <div id="apply-form-lower-part">
                    <span className="full-input">
                        <label >IDENTITY CARD NO</label>
                        <input disabled value={ic_no} type="text" name="ic_no" />
                    </span>
                    <span className="full-input">
                        <label >MARITAL STATUS</label>
                        <select disabled name="marital_status" defaultValue={marital_status} >
                            <option value="" disabled hidden> </option>
                            <option>Single</option>
                            <option>Married</option>
                            <option>Widowed</option>
                            <option>Separated</option>
                            <option>Divorced</option>
                        </select>                    
                    </span>
                    <span className="full-input">
                        <label >CURRENT ADDRESS</label>
                        <input disabled value={current_address} type="text" name="current_address" />
                    </span>
                    <span className="full-input">
                        <label >PERMANENT ADDRESS</label>
                        <input disabled value={permanent_address} type="text" name="permanent_address" />
                    </span>

                    <p className='section-header'>PROGRAM OF STUDY</p>
                    <span className="full-input">
                        <label >PROGRAM</label>
                        <select disabled name="program" defaultValue={program}>
                            <option value="" disabled hidden> </option>
                            <option>Bachelor of Computer Science(Software Engineering)</option>
                            <option>Bachelor of Computer Science(Artificial Intelligence)</option>
                            <option>Bachelor of Computer Science(Information Systems)</option>
                            <option>Bachelor of Computer Science(Computer System and Technology)</option>
                            <option>Bachelor of Computer Science(Data Science)</option>
                            <option>Bachelor of Computer Science(Multimedia Computing)</option>
                        </select>                    
                    </span>
                    <span className="full-input">
                        <label >DEPARTMENT</label>
                        <select disabled name="department" defaultValue={department} >
                            <option value="" disabled hidden> </option>
                            <option>Software Engineering</option>
                            <option>Artificial Intelligence</option>
                            <option>Information Systems</option>
                            <option>Computer System & Technology</option>
                            <option>Multimedia</option>
                        </select>
                    </span>
                    <span className="half-input">
                        <label >YEAR</label>
                        <input disabled type="number" name="year_of_study" min="1" max="4" defaultValue={year_of_study} />
                    </span>
                    <span className="half-input">
                        <label >SEMESTER</label>
                        <input disabled type="number" name="semester" min="1" max="3" defaultValue={semester} />
                    </span>

                    <p className='section-header'>FAMILY INFORMATION</p>
                    <span className="half-input">
                        <label >FATHER/GUARDIAN OCCUPATION</label>
                        <input disabled value={father_occ} type="text" name="father_occ" />
                    </span>
                    <span className="half-input">
                        <label >TOTAL MONTHLY INCOME (RM)</label>
                        <input disabled type="number" name="father_income" min="0" defaultValue={father_income} />
                    </span>
                    <span className="half-input">
                        <label >MOTHER/GUARDIAN OCCUPATION</label>
                        <input disabled value={mother_occ} type="text" name="mother_occ" />
                    </span>
                    <span className="half-input">
                        <label >TOTAL MONTHLY INCOME (RM)</label>
                        <input disabled type="number" name="mother_income" min="0" defaultValue={mother_income} />
                    </span>
                    <span className="full-input">
                        <label >TOTAL MONTHLY INCOME (RM)</label>
                        <input disabled value={total_income} type="number" name="total_income" min="0" readOnly/>
                    </span>
                    <span className="full-input">
                        <label >NUMBER OF SIBLINGS</label>
                        <input disabled type="number" name="no_sibling" min="0" defaultValue={no_sibling} />
                    </span>
                    <span className="full-input">
                        <label >NUMBER OF DEPENDENTS</label>
                        <input disabled type="number" name="no_dependent" min="0" defaultValue={no_dependent} />
                    </span>
                    <span className="full-input">
                        <label >SUPPORTING DOCUMENT</label>
                        <input className="hidden" ref={fileUploadInput} type="file" accept=".zip,.rar,.7zip" name="document"/>
                        <input disabled ref={fileTextDisplay} onClick={(isVerify)?handleTextInputOnClick:()=>{}} type="text" defaultValue={document.name}/>
                    </span>
                    <p id="file-upload-reminder">* Please upload your parents or guardian salary statement together with supporting documents in zip files</p>
                </div>
                <div id="tnc-section">
                    <input disabled checked value="1" type="checkbox"/>
                    <p>By proceeding you agree to our <a>Term and Condition</a></p>
                </div>
                {isVerify?
                    <div id="verify-section">
                        <button onClick={toggleApprove} id="approve-button">Approve</button>
                        <button onClick={toggleReject} id="reject-button">Reject</button>
                    </div>:
                    <button onClick={toggleVerify} id="create-button">Verify</button>}
            </form>
            </>}
        </React.Fragment>
    )
}


export default ViewUserEventApplication;