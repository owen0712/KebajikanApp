import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './allocated_student_list.css';
import Pagination from '@mui/material/Pagination';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import { Status } from '../../../../components';

const AllocatedStudentList = (props) => {

    const allocated_student= props.allocated_student;
    const setAllocatedStudent = props.setAllocatedStudent;
    const isEdit = props.isEdit;
    const [displayedAllocatedStudent,setDisplayAllocatedStudent] = useState([]);
    const [page,setPage] = useState(0);
    const ROW_PER_PAGE = 5;
    const navigate = useNavigate();

    useEffect(()=>{
        setDisplayedAllocatedStudent();
    },[page,allocated_student,isEdit])
       
    useEffect(()=>{
        setPage(1);
    },[])

    const handlePageOnChange = (event, value) => {
        setPage(value);
    }

    const setDisplayedAllocatedStudent = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow =  page * ROW_PER_PAGE;
        if(lastRow>=allocated_student.length){
            setDisplayAllocatedStudent(allocated_student.slice(firstRow-1));
        }
        setDisplayAllocatedStudent(allocated_student.slice(firstRow-1,lastRow));
    }

    const handleViewAllocatedStudent = (id) => {
        console.log("View"+id)
        // navigate('/part_time_job/allocated_student/view/'+id);
    }

    const handleEditAllocatedStudent = (id) => {
        console.log("Edit"+id)
        // navigate('/part_time_job/allocated_student/edit/'+id);
    }
        
    return (
        <React.Fragment>
            <table id="job-allocated-student-list">
                <thead>
                    <th>STUDENT'S NAME</th>
                    <th>DATE APPROVED</th>
                    <th>STATUS</th>
                    <th></th>
                </thead>
                <tbody>
                    {
                        displayedAllocatedStudent.map(allocatedStudent=>{
                            return <tr key={allocatedStudent._id} className='allocated-student'>
                            <td>{allocatedStudent.name}</td>
                            <td>{allocatedStudent.verified_on.slice(0,10)}</td>
                            <td><Status statusName={allocatedStudent.status}/></td>
                            <td>
                                <button className='button' onClick={()=>handleViewAllocatedStudent(allocatedStudent._id)}><RemoveRedEyeIcon/>View</button>
                                <button className='button' onClick={()=>handleEditAllocatedStudent(allocatedStudent._id)}><CreateIcon/>Edit</button>  
                            </td>
                            </tr>
                        })
                    }
                </tbody>
                <div id="job-allocated-student-list-pagination">
                    <Pagination count={allocated_student.length<=ROW_PER_PAGE?1:parseInt(allocated_student.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
                </div>
            </table>  
        </React.Fragment>
    )
}


export default AllocatedStudentList;