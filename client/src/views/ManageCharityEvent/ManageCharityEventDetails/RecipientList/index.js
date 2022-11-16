import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './recipientlist.css';
import Pagination from '@mui/material/Pagination';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import { Status } from '../../../../components';

const RecipientList = (props) => {

    const recipients= props.recipients;
    const setRecipients = props.setRecipients;
    const isEdit = props.isEdit;
    const [displayedRecipients,setDisplayRecipients] = useState([]);
    const [page,setPage] = useState(0);
    const ROW_PER_PAGE = 5;
    const navigate = useNavigate();

    useEffect(()=>{
        setDisplayedRecipient();
    },[page,recipients,isEdit])
       
    useEffect(()=>{
        setPage(1);
    },[])

    const handlePageOnChange = (event, value) => {
        setPage(value);
    }

    const setDisplayedRecipient = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow =  page * ROW_PER_PAGE;
        if(lastRow>=recipients.length){
            setDisplayRecipients(recipients.slice(firstRow-1));
        }
        setDisplayRecipients(recipients.slice(firstRow-1,lastRow));
    }

    const handleViewRecipient = (id) => {
        navigate('/charity_event/recipient/view/'+id);
    }

    const handleEditRecipient = (id) => {
        navigate('/charity_event/recipient/edit/'+id);
    }
        
    return (
        <React.Fragment>
            <table id="charity-recipient-list">
                <thead>
                    <th>STUDENT'S NAME</th>
                    <th>DATE APPROVED</th>
                    <th>STATUS</th>
                    <th></th>
                </thead>
                <tbody>
                    {
                        displayedRecipients.map(recipient=>{
                            return <tr key={recipient._id} className='recipient'>
                            <td>{recipient.name}</td>
                            <td>{recipient.created_on.slice(0,10)}</td>
                            <td><Status statusName={recipient.status}/></td>
                            <td>
                                <button className='button' onClick={()=>handleViewRecipient(recipient._id)}><RemoveRedEyeIcon/>View</button>
                                <button className='button' onClick={()=>handleEditRecipient(recipient._id)}><CreateIcon/>Edit</button>  
                            </td>
                            </tr>
                        })
                    }
                </tbody>
                <div id="charity-recipient-list-pagination">
                    <Pagination count={recipients.length<=ROW_PER_PAGE?1:parseInt(recipients.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
                </div>
            </table>  
        </React.Fragment>
    )
}


export default RecipientList;