import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './contact_list.css';
import { useUser } from '../../../contexts/UserContext';
import Swal from 'sweetalert2';
import { Loading } from '../../../components';

const ContactList = (props) => {

    const navigate = useNavigate();
    const user = useUser();
    const [relations,setRelations] = useState([]);
    const [displayRelations,setDisplayRelations] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const setChatMate = props.setChatMate;
    const chatmate = props.chatmate;

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

    const fetchData = () => {
        setIsLoading(true);
        fetch('/chat',{
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

    const handleSearchOnChange = (event) => {
        if(!event.target.value){
            setDisplayRelations(relations);
            return;
        }
        setDisplayRelations(relations.filter(relation=>{
            return relation.chatmate_id.name.includes(event.target.value);
        }))
    }

    const handleContactOnClick = (id) => {
        setChatMate(id);
    }
        
    return (
        <React.Fragment>
            <div className='contact-list'>
                {isLoading?<Loading/>:<>
                <input className='search-bar' placeholder='Search contacts' onChange={handleSearchOnChange}/>
                {
                    displayRelations.map(relation=>{
                        return <div className={`contact ${relation.chatmate_id._id==chatmate?'selected':''}`} key={relation._id} onClick={()=>handleContactOnClick(relation.chatmate_id._id)}>
                            <img src={relation.chatmate_id.profile_pic}/>
                            <span>{relation.chatmate_id.name}</span>
                            <small>2022-10-23</small>
                        </div>
                    })
                }</>
                }
            </div>
        </React.Fragment>
    )
}


export default ContactList;