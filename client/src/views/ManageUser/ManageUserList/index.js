import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './manage_user_list.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import Pagination from '@mui/material/Pagination';
import Swal from 'sweetalert2';
import { Status, BackSection, Loading, Dropdown } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const roleOption = [
    "User", 
    "Organizer", 
    "Admin", 
];

const ManageUserList = () => {

    const navigate = useNavigate();
    const [name,setName] = useState(""); 
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirm_password,setConfirmPassword] = useState("");
    const [role,setRole] = useState("User"); 
    const [users,setUsers] = useState([]);
    const [displayedUsers,setDisplayUsers] = useState([]);
    const [page,setPage] = useState(0);
    const [isLoading,setIsLoading] = useState(true);
    const [isOpenForm,setIsOpenForm] = useState(false);
    const user = useUser();
    const ROW_PER_PAGE = 8;

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            if(user.role!=2){
                navigate('/');
            }
            fetchData();
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])
    
    useEffect(()=>{
        setDisplayedUser();
    },[page,users])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/users',{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setUsers(data.users);
                setPage(1);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleNameOnChange = (event) => {
        setName(event.target.value);
    }

    const handleEmailOnChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordOnChange = (event) => {
        setPassword(event.target.value);
    }

    const handleConfirmPasswordOnChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleRoleOnChange = (event) => {
        setRole(event.target.value);
    }

    const handlePageOnChange = (event, value) => {
        setPage(value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(password!=confirm_password){
            Swal.fire({
                icon: 'error',
                title: "Both password are not same",
            })
            return;
        }
        setIsLoading(true);
        fetch('/user/create',{
            method:'post',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                name,
                email,
                password,
                role
            })
        }).then(res=>res.json()).then(data=>{
            console.log("Data",data);
            setIsLoading(false);
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
                    title: data.message,
                    confirmButtonText: 'OK'
                });
                navigatePrev();
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    const handleView = (id) => {
        navigate('/manage_user/view/'+id);
    }

    const handleEdit = (id) => {
        navigate('/manage_user/edit/'+id);
    }

    const navigatePrev = () =>{
        navigate('/admin');
    }

    const handleCloseForm = () => {
        setIsOpenForm(false);
    }

    const handleOpenForm = () => {
        setIsOpenForm(true);
    }

    const setDisplayedUser = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow = page * ROW_PER_PAGE;
        if(lastRow>=users.length){
            setDisplayUsers(users.slice(firstRow-1));
        }
        setDisplayUsers(users.slice(firstRow-1,lastRow));
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection title="User" previousIsHome={true} createButtonName="Create New User" onBackButtonClick={navigatePrev} handleButtonCreate={handleOpenForm}/>
            <div id="user-list-table-section">
                <table>
                    <thead>
                        <tr id="user-list-table-header-row">
                            <th className="full-name-header-cell">FULL NAME</th>
                            <th className="role">ROLE</th>
                            <th className="user-status">STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        displayedUsers.map(user=>{
                            return <tr key={user._id}>
                                <td><div className="full-name-cell"><img className='profile-pic' src={(user.profile_pic)?user.profile_pic:""}/>  <p className='full-name'>{user.name}</p></div></td>
                                <td>{user.role}</td>
                                <td><Status statusName={user.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleView(user._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' disabled={(user.status=="Not Active")} onClick={(user.status=="Not Active")?()=>{}:()=>handleEdit(user._id)} ><CreateIcon/>Edit</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {users.length>0&&<div id="user-list-pagination">
                    <Pagination count={users.length<=ROW_PER_PAGE?1:parseInt(users.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
                </div>}
            </div>
            <div id='create-form-modal'>
                <Modal
                    open={isOpenForm}
                    onClose={handleCloseForm}
                >
                    <div className='form-modal-box'>
                        <div className='form-modal-close-section'>
                            <CloseIcon onClick={handleCloseForm}/>
                        </div>
                        <h2 className='form-modal-view-title'>
                            CREATE NEW USER
                        </h2>
                        <div className='form-modal-view-frame'>
                            <form id="create-user-form" onSubmit={event=>handleSubmit(event)}>
                                <span>
                                    <label>FULL NAME *</label>
                                    <input type="text" onChange={event=>handleNameOnChange(event)}/>
                                </span>
                                <span>
                                    <label>EMAIL *</label>
                                    <input type="email" onChange={event=>handleEmailOnChange(event)}/>
                                </span>
                                
                                <span>
                                    <label>PASSWORD *</label>
                                    <input type="password" onChange={event=>handlePasswordOnChange(event)}/>
                                </span>
                                <span>
                                    <label>CONFIRM PASSWORD *</label>
                                    <input type="password" onChange={event=>handleConfirmPasswordOnChange(event)}/>
                                </span>
                                <Dropdown
                                    optionList={roleOption}
                                    label = "ROLE *"
                                    value = {role}
                                    handleOnChange = {handleRoleOnChange}
                                    inputClassName = "long-input"
                                    styling = {{border:"0",borderRadius:"5px",width:"100%"}}
                                />
                                <div className='form-modal-view-action-section'>
                                    <input type="submit" value="Create" id="create-button"/>
                                    <button className="modal-close-button" onClick={handleCloseForm}>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
            </>}            
        </React.Fragment>
    )
}

export default ManageUserList;