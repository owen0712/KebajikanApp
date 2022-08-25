import React, { useRef, useState, useEffect } from 'react';
import {useParams, useNavigate, Navigate} from 'react-router-dom';
import './apply_help.css';
import { BackSection, Loading } from '../../../components';
import Swal from 'sweetalert2';
import Dropdown from '../../../components/Dropdown';
import { useUser } from '../../../contexts/UserContext';

const ApplyForHelp = (props) => {

    const [name,setName] = useState("");
    const [phone_number,setPhoneNumber] = useState("");
    const [identity_no,setIdentityNo] = useState("");
    const [email,setEmail] = useState("");
    const [ic_no,setIcNo] = useState("");
    const [marital_status,setMaritalStatus] = useState("");
    const [current_address,setCurrentAddress] = useState("");
    const [permanent_address,setPermanentAddress] = useState("");
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
    const event_id = useParams();
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const fileUploadInput = useRef();
    const fileTextDisplay = useRef();
    const navigate = useNavigate();
    const user = useUser();

    const maritalStatusOption = [
        "Single",
        "Married",
        "Widowed",
        "Separated",
        "Divorced",
    ]

    const programOption = [
        "Bachelor of Computer Science(Software Engineering)",
        "Bachelor of Computer Science(Artificial Intelligence)",
        "Bachelor of Computer Science(Information Systems)",
        "Bachelor of Computer Science(Computer System and Technology)",
        "Bachelor of Computer Science(Data Science)",
        "Bachelor of Computer Science(Multimedia Computing)"
        
    ]

    const departmentOption = [
        "Software Engineering",
        "Artificial Intelligence",
        "Information Systems",
        "Computer System & Technology",
        "Multimedia"
    ]

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/charity_event/name/'+event_id.event_id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
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
                setEventName(data.name);
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

    const handleNameOnChange = (event) => {
        setName(event.target.value);
    }

    const handlePhoneNumberOnChange = (event) =>{
        setPhoneNumber(event.target.value);
    }

    const handleIdentityNoOnChange = (event) => {
        setIdentityNo(event.target.value);
    }

    const handleEmailOnChange = (event) =>{
        setEmail(event.target.value);
    }

    const handleIcNoOnChange = (event) => {
        setIcNo(event.target.value);
    }
    
    const handleMaritalStatusOnChange = (event) => {
        setMaritalStatus(event.target.value);
    }
    
    const handleCurrentAddressOnChange = (event) => {
        setCurrentAddress(event.target.value);
    }

    const handlePermanentAddressOnChange = (event) => {
        setPermanentAddress(event.target.value);
    }

    const handleProgramOnChange = (event) => {
        setProgram(event.target.value);
    }

    const handleDepartmentOnChange = (event) => {
        setDepartment(event.target.value);
    }

    const handleYearOfStudyOnChange = (event) =>{
        setYearOfStudy(event.target.value);
    }

    const handleSemesterOnChange = (event) => {
        setSemester(event.target.value);
    }

    const handleFatherOccOnChange = (event) =>{
        setFatherOcc(event.target.value);
    }

    const handleMotherOccOnChange = (event) => {
        setMotherOcc(event.target.value);
    }
    
    const handleFatherIncomeOnChange = (event) => {
        setFatherIncome(event.target.value);
        setTotalIncome(parseInt(event.target.value)+parseInt(mother_income));
    }
    
    const handleMotherIncomeOnChange = (event) => {
        setMotherIncome(event.target.value);
        setTotalIncome(parseInt(event.target.value)+parseInt(father_income))
    }

    const handleSiblingNoOnChange = (event) => {
        setSiblingNo(event.target.value);
    }

    const handleDependentNoOnChange = (event) => {
        setDependentNo(event.target.value);
    }

    const handleTextInputOnClick = () => {
        fileUploadInput.current.click();
    }

    const handleFileOnChange = (event) => {
        const setDocumentUploaded = (documentUploaded) =>{
            setDocument(documentUploaded);
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
            Swal.fire({
                title: error,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        };
        fileTextDisplay.current.value = event.target.files[0].name;
    }

    const handleImageOnClick = () => {
        imageUploadInput.current.click();
    }

    const handleImageOnChange = (event) => {
        const setPhotoUploaded=(photoUploaded)=>{
            setPhoto(photoUploaded);
        }
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            setPhotoUploaded({
                name:event.target.files[0].name,
                content:reader.result
            });
        }
        reader.onerror = function (error) {
            Swal.fire({
                title: error,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        };
        imageDisplay.current.src = URL.createObjectURL(event.target.files[0]);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(!isAgree){
            Swal.fire({
                icon:"error",
                title:"Please tick the agreement checkbox",
                confirmButtonText: 'Ok'
            });
            return;
        }
        fetch('/charity_application/'+event_id.event_id,{
            method:'post',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
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
                photo,
                user_id:user.id,
                role:user.role
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    icon:"error",
                    title:data.error,
                    confirmButtonText: 'Ok'
                });
            }
            else{
                Swal.fire({
                    icon:"success",
                    title:data.message,
                    confirmButtonText: 'Ok'
                }).then(
                    navigate('/charity_event/view/'+event_id.event_id)
                );
            }
        }).catch(err=>{
            Swal.fire({
                icon:"error",
                title:err,
                confirmButtonText: 'Ok'
            });
        })
    }

    const handleRedirectBack = () => {
        navigate('/charity_event/view/'+event_id.event_id)
    }

    const handleIsAgreeOnChange = (event) => {
        setIsAgree(event.target.value);
    }
        
    return (
        <React.Fragment>
            {user==null?<Navigate to="/login"/>:<></>}
            <BackSection title={event_name+"  Application Form"} onBackButtonClick={handleRedirectBack}/>
            {isLoading?<Loading/>:<>
            <form id="application-form" onSubmit={event=>handleSubmit(event)}>
                <p className='section-header'>APPLICATION DETAILS</p>
                <div id="apply-form-upper-part">
                    <span className="file-upload">
                        <input className="hidden" ref={imageUploadInput} type="file" accept="image/*" onChange={event=>handleImageOnChange(event)}/>
                        <img ref={imageDisplay} src="data:," name="image" onClick={handleImageOnClick}/>
                    </span>
                    <div id="apply-form-right-content">
                        <span className="full-input">
                            <label >NAME</label>
                            <input type="text" name="name" onChange={event=>handleNameOnChange(event)}/>
                        </span>
                        <span className="full-input">
                            <label >PHONE NUMBER</label>
                            <input type="text" name="phone_number" onChange={event=>handlePhoneNumberOnChange(event)}/>
                        </span>
                        <span className="full-input">
                            <label >MATRIC NO</label>
                            <input type="text" name="identity_no" onChange={event=>handleIdentityNoOnChange(event)}/>
                        </span>
                        <span className="full-input">
                            <label >EMAIL</label>
                            <input type="email" name="email" onChange={event=>handleEmailOnChange(event)}/>
                        </span>
                    </div>
                </div>
                <div id="apply-form-lower-part">
                    <span className="full-input">
                        <label >IDENTITY CARD NO</label>
                        <input type="text" name="ic_no" onChange={event=>handleIcNoOnChange(event)}/>
                    </span>
                    <Dropdown
                        optionList={maritalStatusOption}
                        label = "MARITAL STATUS"
                        value = {marital_status}
                        handleOnChange = {handleMaritalStatusOnChange}
                    />
                    {/* <span className="full-input">
                        <label >MARITAL STATUS</label>
                        <select name="marital_status" defaultValue={""} onChange={event=>handleMaritalStatusOnChange(event)}>
                            <option value="" disabled hidden> </option>
                            <option>Single</option>
                            <option>Married</option>
                            <option>Widowed</option>
                            <option>Separated</option>
                            <option>Divorced</option>
                        </select>                    
                    </span> */}
                    <span className="full-input">
                        <label >CURRENT ADDRESS</label>
                        <input type="text" name="current_address" onChange={event=>handleCurrentAddressOnChange(event)}/>
                    </span>
                    <span className="full-input">
                        <label >PERMANENT ADDRESS</label>
                        <input type="text" name="permanent_address" onChange={event=>handlePermanentAddressOnChange(event)}/>
                    </span>

                    <p className='section-header'>PROGRAM OF STUDY</p>
                    <Dropdown
                        optionList={programOption}
                        label = "PROGRAM"
                        value = {program}
                        handleOnChange = {handleProgramOnChange}
                    />
                    {/* <span className="full-input">
                        <label >PROGRAM</label>
                        <select name="program" defaultValue={""}onChange={event=>handleProgramOnChange(event)}>
                            <option value="" disabled hidden> </option>
                            <option>Bachelor of Computer Science(Software Engineering)</option>
                            <option>Bachelor of Computer Science(Artificial Intelligence)</option>
                            <option>Bachelor of Computer Science(Information Systems)</option>
                            <option>Bachelor of Computer Science(Computer System and Technology)</option>
                            <option>Bachelor of Computer Science(Data Science)</option>
                            <option>Bachelor of Computer Science(Multimedia Computing)</option>
                        </select>                    
                    </span> */}
                    <Dropdown
                        optionList={departmentOption}
                        label = "DEPARTMENT"
                        value = {department}
                        handleOnChange = {handleDepartmentOnChange}
                    />
                    {/* <span className="full-input">
                        <label >DEPARTMENT</label>
                        <select name="department" defaultValue={""} onChange={event=>handleDepartmentOnChange(event)}>
                            <option value="" disabled hidden> </option>
                            <option>Software Engineering</option>
                            <option>Artificial Intelligence</option>
                            <option>Information Systems</option>
                            <option>Computer System & Technology</option>
                            <option>Multimedia</option>
                        </select>
                    </span> */}
                    <span className="half-input">
                        <label >YEAR</label>
                        <input type="number" name="year_of_study" min="1" max="4" defaultValue="1" onChange={event=>handleYearOfStudyOnChange(event)}/>
                    </span>
                    <span className="half-input">
                        <label >SEMESTER</label>
                        <input type="number" name="semester" min="1" max="3" defaultValue="1" onChange={event=>handleSemesterOnChange(event)}/>
                    </span>

                    <p className='section-header'>FAMILY INFORMATION</p>
                    <span className="half-input">
                        <label >FATHER/GUARDIAN OCCUPATION</label>
                        <input type="text" name="father_occ" onChange={event=>handleFatherOccOnChange(event)}/>
                    </span>
                    <span className="half-input">
                        <label >TOTAL MONTHLY INCOME (RM)</label>
                        <input type="number" name="father_income" min="0" defaultValue={0} onChange={event=>handleFatherIncomeOnChange(event)}/>
                    </span>
                    <span className="half-input">
                        <label >MOTHER/GUARDIAN OCCUPATION</label>
                        <input type="text" name="mother_occ" onChange={event=>handleMotherOccOnChange(event)}/>
                    </span>
                    <span className="half-input">
                        <label >TOTAL MONTHLY INCOME (RM)</label>
                        <input type="number" name="mother_income" min="0" defaultValue={0} onChange={event=>handleMotherIncomeOnChange(event)}/>
                    </span>
                    <span className="full-input">
                        <label >TOTAL MONTHLY INCOME (RM)</label>
                        <input type="number" name="total_income" min="0" value={total_income} readOnly/>
                    </span>
                    <span className="full-input">
                        <label >NUMBER OF SIBLINGS</label>
                        <input type="number" name="no_sibling" min="0" defaultValue={0} onChange={event=>handleSiblingNoOnChange(event)}/>
                    </span>
                    <span className="full-input">
                        <label >NUMBER OF DEPENDENTS</label>
                        <input type="number" name="no_dependent" min="0" defaultValue={0} onChange={event=>handleDependentNoOnChange(event)}/>
                    </span>
                    <span className="full-input">
                        <label >SUPPORTING DOCUMENT</label>
                        <input className="hidden" ref={fileUploadInput} onChange={event=>handleFileOnChange(event)} type="file" accept=".zip,.rar,.7zip" name="document"/>
                        <input ref={fileTextDisplay} onClick={handleTextInputOnClick} type="text" defaultValue="No file is chosen"/>
                    </span>
                    <p id="file-upload-reminder">* Please upload your parents or guardian salary statement together with supporting documents in zip files</p>
                </div>
                <div id="tnc-section">
                    <input type="checkbox" onChange={event=>handleIsAgreeOnChange(event)}/>
                    <p>By proceeding you agree to our <a>Term and Condition</a></p>
                </div>
                <input type="submit" value="Submit" id="create-button"/>
            </form>
            </>}
        </React.Fragment>
    )
}


export default ApplyForHelp;