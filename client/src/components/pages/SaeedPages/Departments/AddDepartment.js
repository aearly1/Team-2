import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import useToken from '../../general/useToken';
import axios from 'axios';

function AddDepartment(props){
const token = useToken().token;

    const handleSubmit = (e1)=> {
      e1.preventDefault();
      axios.post('http://localhost:5000/api/hr/addDepartment',{'departmentName':Department,'facultyName':Faculty},{headers:{'auth-token':token}}).then((res)=>{
      alert(res.data)    
      }).catch(err=>alert(err))  
      }
            const [Faculty,setFacultyName]= useState('');
            const [Department,setDepartments]= useState('');
        const changeFaculty = (event) =>{
            setFacultyName(event.target.value)
            }
        
        const changeDepartments = (event) =>{
            setDepartments(event.target.value)
            }
    
    return (
   <form onSubmit={handleSubmit}>
        <label>
          Department Name:
          </label>
          <input type="text" class="form-control" required value={Department} onChange={changeDepartments} />
        
        <br/>
        <label>
          Faculty Name:
          </label>
          <input type="text" class="form-control" required value={Faculty} onChange={changeFaculty} />
        
        <br/>
                <Button variant="success" type="submit"> Add Department  </Button>
      </form>
    )
}
export default AddDepartment
