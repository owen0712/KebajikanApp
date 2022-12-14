import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './manage_user_list.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import { Status, BackSection, Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ManageUserList = () => {

    const navigate = useNavigate();
    const [users,setUsers] = useState([]);
    const [pageNumber,setPageNumber] = useState(1);
    const [isLoading,setIsLoading] = useState(true);
    const user = useUser();

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
                setUsers(data.users)
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleCreate = () => {
        console.log("Create");
        // navigate('/manage_part_time_job/create');
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

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection title="User" previousIsHome={true} createButtonName="Create New Usere" onBackButtonClick={navigatePrev} handleButtonCreate={handleCreate}/>
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
                        users.map(user=>{
                            return <tr key={user._id}>
                                <td><div className="full-name-cell"><img className='profile-pic' src={(user.profile_pic)?user.profile_pic:""}/>  <p className='full-name'>{user.name}</p></div></td>
                                <td>{user.role}</td>
                                <td><Status statusName={user.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleView(user._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEdit(user._id)}><CreateIcon/>Edit</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            </>}            
        </React.Fragment>
    )
}

export default ManageUserList;