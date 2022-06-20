import React, { useRef, useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import './apply_help.css';
import BackSection from '../../../components/BackSection';

const ApplyForHelp = (props) => {

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
    const id = useParams();
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const fileUploadInput = useRef();
    const fileTextDisplay = useRef();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/charity_event/name/'+id.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setEventName(data.name);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
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
            console.log('Error: ', error);
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
            console.log('Error: ', error);
        };
        imageDisplay.current.src = URL.createObjectURL(event.target.files[0]);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/charity_application/'+id.id,{
            method:'post',
            headers:{
                'Content-Type':'application/json'
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
            if(data.error){
                console.log(data.error);
            }
            else{
                console.log(data.message);
            }
        }).catch(err=>{
            console.log(err);
        })
    }
        
    return (
        <React.Fragment>
            <BackSection title={event_name+"  Application Form"}/>
            {isLoading?"":<>
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
                    <span className="full-input">
                        <label >MARITAL STATUS</label>
                        <select name="marital_status" defaultValue={""} onChange={event=>handleMaritalStatusOnChange(event)}>
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
                        <input type="text" name="current_address" onChange={event=>handleCurrentAddressOnChange(event)}/>
                    </span>
                    <span className="full-input">
                        <label >PERMANENT ADDRESS</label>
                        <input type="text" name="permanent_address" onChange={event=>handlePermanentAddressOnChange(event)}/>
                    </span>

                    <p className='section-header'>PROGRAM OF STUDY</p>
                    <span className="full-input">
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
                    </span>
                    <span className="full-input">
                        <label >DEPARTMENT</label>
                        <select name="department" defaultValue={""} onChange={event=>handleDepartmentOnChange(event)}>
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
                    <input type="checkbox"/>
                    <p>By proceeding you agree to our <a>Term and Condition</a></p>
                </div>
                <input type="submit" value="Submit" id="create-button"/>
            </form>
            </>}
        </React.Fragment>
    )
}


export default ApplyForHelp;