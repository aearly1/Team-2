import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
function DeleteFaculty(props){

    const handleSubmit = (e1)=> {
        alert('A name was submitted: ' + facultyName);
        e1.preventDefault();
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
