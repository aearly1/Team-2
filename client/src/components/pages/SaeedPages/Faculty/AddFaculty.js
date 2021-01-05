import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
function AddFaculty(props){

    const handleSubmit = (e1)=> {
        alert('A name was submitted: ' + facultyName+" "+Department);
        e1.preventDefault();
        }
            const [facultyName,setFacultyName]= useState('');
            const [Department,setDepartments]= useState('');
        const changeFaculty = (event) =>{
            setFacultyName(event.target.value)
            }
        
        const changeDepartments = (event) =>{
            setDepartments(event)
            }
    
    return (
   <form onSubmit={handleSubmit}>
        <label>
          Faculty Name:
          </label>
          <input required type="text" class="form-control" value={facultyName} onChange={changeFaculty} />
        
        <br/>
        <label>
          Departments:
          </label>
          <DropdownButton variant="warning" onSelect={changeDepartments} id="dropdown-basic-button" title={(Department==='')?"Departments ":Department}>
                {props.Departments.map(Department1 => {
                      return <Dropdown.Item eventKey={Department1}>{Department1}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     <br/>
                <Button variant="success" type="submit"> Add Faculty  </Button>
      </form>
    )
}
AddFaculty.propTypes = {
  Departments: PropTypes.array
}

AddFaculty.defaultProps = {
  Departments: ['CSEN','DMET','MECHA']
};
export default AddFaculty
