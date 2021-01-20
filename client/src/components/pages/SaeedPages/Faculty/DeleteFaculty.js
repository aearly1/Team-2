import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import axios from 'axios';
import useToken from '../../general/useToken';
import Select from 'react-select'

function DeleteFaculty(props){
const token = useToken().token
    const handleSubmit = (e1)=> {
      e1.preventDefault();
      axios.post('http://localhost:5000/api/hr/deleteFaculty',{'facultyName':facultyName},{headers:{'auth-token':token}}).then((res)=>{
      alert(res.data)    
      }).catch(err=>alert(err))
 
        }
            const [facultyName,setFacultyName]= useState('');
       
        const changeFaculty = (event) =>{
            setFacultyName(event.target.value)
            }
        

    
    return (
   <form onSubmit={handleSubmit}>
        <label>
          Faculty Name:
          </label>
          <input required type="text" class="form-control" value={facultyName} onChange={changeFaculty} />
        
        <br/>
       
                <Button variant="danger" type="submit"> Delete Faculty  </Button>
      </form>
    )
}
DeleteFaculty.propTypes = {
  Departments: PropTypes.array
}

DeleteFaculty.defaultProps = {
  Departments: ['CSEN','DMET','MECHA']
};
export default DeleteFaculty
