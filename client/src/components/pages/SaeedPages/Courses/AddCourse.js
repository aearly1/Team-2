import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import useToken from '../../general/useToken';
import axios from 'axios';

function AddCourse(props){
const token = useToken().token

    const handleSubmit = (e1)=> {
        e1.preventDefault();
        axios.post('http://localhost:5000/api/hr/addCourse',{'departmentName':Department,'courseName':Course},{headers:{'auth-token':token}}).then((res)=>{
        alert(res.data)    
        }).catch(err=>alert(err))          }
            const [Department,setDepartmentName]= useState('');
            const [Course,setCourses]= useState('');
        const changeDepartment = (event) =>{
            setDepartmentName(event.target.value)
            }
        
        const changeCourses = (event) =>{
            setCourses(event.target.value)
            }
    
    return (
   <form onSubmit={handleSubmit}>
        <label>
          Course Name:
          </label>
          <input type="text" class="form-control" required value={Course} onChange={changeCourses} />
<br/>        <label>
          Department Name:
          </label>
          <input type="text" class="form-control" required value={Department} onChange={changeDepartment} />
<br/>                <Button variant="success" type="submit"> Add Course </Button>
      </form>
    )
}

export default AddCourse
