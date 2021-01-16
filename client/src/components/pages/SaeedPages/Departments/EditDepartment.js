import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import useToken from '../../general/useToken';
import axios from 'axios';

function EditDepartment(props){
const token = useToken().token;
    const handleSubmit = (e1)=> {
      e1.preventDefault();
      axios.post('https://localhost:5000/api/hr/editDepartment',{'departmentName':Department,'oldFacultyName':oldFaculty,'newFacultyName':newFaculty},{headers:{'auth-token':token}}).then((res)=>{
      alert(res.data)    
      }).catch(err=>alert(err))  
        }
        const [newFaculty,setNewFacultyName]= useState('');
        const [oldFaculty,setOldFacultyName]= useState('');
            const [Department,setDepartments]= useState('');
        const changeOldFaculty = (event) =>{
            setOldFacultyName(event.target.value)
            }
        
            const changeNewFaculty = (event) =>{
              setNewFacultyName(event.target.value)
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
          New Faculty Name:
          </label>
          <input type="text" class="form-control" required value={newFaculty} onChange={changeNewFaculty} />
        
        <br/>
     <label>
          Old Faculty Name:
          </label>
          <input type="text" class="form-control" required value={oldFaculty} onChange={changeOldFaculty} />
        
     <br/>
                <Button variant="success" type="submit"> Update Department  </Button>
      </form>
    )
}
EditDepartment.propTypes = {
  Departments: PropTypes.array,
  Faculties: PropTypes.array
}

EditDepartment.defaultProps = {
  Departments: ['CSEN','DMET','MECHA'],
  Faculties: ["MET","EMS","IET"]
};
export default EditDepartment
