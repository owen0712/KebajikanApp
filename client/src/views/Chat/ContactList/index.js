import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './contact_list.css';
import { useUser } from '../../../contexts/UserContext';
import Swal from 'sweetalert2';
import { Loading } from '../../../components';
import CircleIcon from '@mui/icons-material/Circle';

const ContactList = (props) => {

    const navigate = useNavigate();
    const user = useUser();
    const [relations,setRelations] = useState([]);
    const [displayRelations,setDisplayRelations] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const setChatMate = props.setChatMate;
    const chatmate = props.chatmate;
    const updateList = props.updateList;
    const setUpdateList = props.setUpdateList;

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            setIsLoading(true);
            fetchData();
            setIsLoading(false);
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    useEffect(()=>{
        if(updateList){
            fetchData();
            setUpdateList(false);
        }
    },[updateList])

    const fetchData = () => {
        fetch('/contact',{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
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
                setRelations(data.relations);
                setDisplayRelations(data.relations);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const updateReadMessage = (chatmate_id) => {
        fetch('/message/'+chatmate_id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
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
                setUpdateList(true);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const handleSearchOnChange = (event) => {
        if(!event.target.value){
            setDisplayRelations(relations);
            return;
        }
        setDisplayRelations(relations.filter(relation=>{
            return relation.chatmate_id.name.includes(event.target.value);
        }))
    }

    const handleContactOnClick = (relation) => {
        setChatMate(relation.chatmate_id._id);
        if(relation.latest_chat_record?.recipient==user.id&&relation.latest_chat_record?.status=="Unread"){
            updateReadMessage(relation.chatmate_id._id);
        }
    }
        
    return (
        <React.Fragment>
            <div className='contact-list'>
                {isLoading?<Loading/>:<>
                <input className='search-bar' placeholder='Search contacts' onChange={handleSearchOnChange}/>
                {
                    displayRelations.map(relation=>{
                        return <div className={`contact ${relation.chatmate_id._id==chatmate?'selected':''} ${relation.latest_chat_record?.recipient==user.id&&relation.latest_chat_record?.status=="Unread"?"unread-message":""}`} 
                        key={relation._id} onClick={()=>handleContactOnClick(relation)}>
                            <img src={relation.chatmate_id.profile_pic}/>
                            <span className='content-row'>
                                <p>{relation.chatmate_id.name}</p>
                                {relation.latest_chat_record&&<small>{relation.latest_chat_record.content}</small>}
                            </span>
                            <span className='other-row'>
                                <small>{relation.modified_on.slice(0,10)}</small>
                                {relation.latest_chat_record?.recipient==user.id&&relation.latest_chat_record?.status=="Unread"?<CircleIcon/>:""}
                            </span>
                        </div>
                    })
                }</>
                }
            </div>
        </React.Fragment>
    )
}


export default ContactList;