import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import useToken from '../../general/useToken';
import axios from 'axios';

function DeleteDepartment(props){
const token = useToken().token
    const handleSubmit = (e1)=> {
      e1.preventDefault();
      axios.post('http://localhost:5000/api/hr/deleteDepartment',{'departmentName':Department,'oldFacultyName':oldFaculty},{headers:{'auth-token':token}}).then((res)=>{
        alert(res.data)    
        }).catch(err=>alert(err))          }
        const [oldFaculty,setOldFacultyName]= useState('');
            const [Department,setDepartments]= useState('');
        const changeOldFaculty = (event) =>{
            setOldFacultyName(event.target.value)
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
          <input type="text" class="form-control" required value={oldFaculty} onChange={changeOldFaculty} />
     <br/>
                <Button variant="danger" type="submit"> Delete Department  </Button>
      </form>
    )
}
export default DeleteDepartment
