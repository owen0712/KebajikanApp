import React, { useEffect, useRef, useState } from 'react'
import './create_item_donation.css';
import BackSection from '../../../components/BackSection';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';
import { Loading } from '../../../components';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

const CreateItemDonation = (props) => {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone_number,setPhoneNumber] = useState("");
    const [item,setItem] = useState({description:"",quantity:null});
    const [items,setItems] = useState([]);
    const [event,setEvent] = useState(null);
    const [isAgree,setIsAgree] = useState(false);
    const [isLoading,setIsLoading] = useState(true);
    const id = useParams();
    const navigate = useNavigate();
    const user = useUser();
    const descriptionInputRef = useRef();
    const quantityInputRef = useRef();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/donation/'+id.id,{
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
                setEvent(data.donation.charity_event_id);
                setName(data.donation.name);
                setEmail(data.donation.email);
                setPhoneNumber(data.donation.phone_number);
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

    const handleEmailOnChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePhoneNumberOnChange = (event) => {
        setPhoneNumber(event.target.value);
    }

    const handleDescriptionOnChange = (event) => {
        setItem(prev=>({...prev,description:event.target.value}));
    }

    const handleQuantityOnChange = (event) => {
        setItem(prev=>({...prev,quantity:event.target.value}));
    }

    const handleIsAgreeOnChange = (event) => {
        setIsAgree(event.target.value);
    }

    const handleAddItemOnClick = () => {
        if(item.description==""||item.quantity==null){
            Swal.fire({
                title: "Please fill alll required item details",
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            return
        }
        setItems(prev=>([...prev,item]));
        setItem({description:"",quantity:null})
        descriptionInputRef.current.value="";
        quantityInputRef.current.value="";
    }

    const handleRemoveItemOnClick = (removedIndex) => {
        setItems(items.filter((item,index)=>index!=removedIndex));
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
        fetch('/donation/item/'+id.id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                name,
                email,
                phone_number,
                items
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    icon:"error",
                    title:data.error
                });
            }
            else{
                Swal.fire({
                    icon:"success",
                    title:data.message
                }).then(
                    navigate('/profile/donation_history')
                );
            }
        }).catch(err=>{
            Swal.fire({
                icon:"error",
                title:err
            });
        })
    }

    const handleRedirectBack = () => {
        navigate('/profile/donation_history');
    }

    return (
        <React.Fragment>
            {user==null?<Navigate to="/login"/>:<></>}
            {isLoading?<Loading/>:<>
            <BackSection onBackButtonClick={handleRedirectBack} title="Item Donation"/>
            <div id="donation-left-content">
                <img src={event.photo.content}/>
                <h2>{event.title}</h2>
                <p>Purpose: {event.purpose}</p>
                <p>Description: {event.description}</p>
                <p>Target Amount: RM{event.amount}</p>
                <p>Duration: {event.donation_start_date.slice(0,10)} - {event.donation_end_date.slice(0,10)}</p>
            </div>
            <div id="donation-right-content">
                <form id="donation_form" onSubmit={event=>handleSubmit(event)}>
                    <span className="short-input">
                        <label >NAME</label>
                        <input type="text" name="name" defaultValue={name} onChange={event=>handleNameOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >EMAIL</label>
                        <input type="email" name="email" defaultValue={email} onChange={event=>handleEmailOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >PHONE NUMBER</label>
                        <input type="text" name="phone_number" defaultValue={phone_number} onChange={event=>handlePhoneNumberOnChange(event)}/>
                    </span>
                    <div className="item-list-board">
                        <p>ITEM LIST</p>
                        <div className='add-item-section'>
                            <label>Item Description: </label>
                            <input ref={descriptionInputRef} type="text" onChange={event=>handleDescriptionOnChange(event)}/>
                            <label>Quantity: </label>
                            <input ref={quantityInputRef} type="number" min="1" onChange={event=>handleQuantityOnChange(event)}/>
                            <AddCircleOutlineIcon onClick={handleAddItemOnClick}/>
                        </div>
                        <div className='item-list'>
                            <table>
                                {items.map((item,index)=>{
                                    return <tr key={index}>
                                        <td>{item.description}</td>
                                        <td>{item.quantity}</td>
                                        <td><CloseIcon onClick={()=>handleRemoveItemOnClick(index)}/></td>
                                    </tr>
                                })}
                            </table>
                        </div>
                    </div>
                    <div id="tnc-section">
                        <input type="checkbox" onChange={event=>handleIsAgreeOnChange(event)}/>
                        <p>By proceeding you agree to our <a>Term and Condition</a></p>
                    </div>
                    <input type="submit" value="Submit" id="submit-button"/>
                </form>
            </div>
            </>}
        </React.Fragment>
    )
}

export default CreateItemDonation;