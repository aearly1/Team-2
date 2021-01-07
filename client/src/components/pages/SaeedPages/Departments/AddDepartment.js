import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
function AddDepartment(props){

    const handleSubmit = (e1)=> {
        alert('A name was submitted: ' + Faculty+" "+Department);
        e1.preventDefault();
        }
            const [Faculty,setFacultyName]= useState('');
            const [Department,setDepartments]= useState('');
        const changeFaculty = (event) =>{
            setFacultyName(event)
            }
        
        const changeDepartments = (event) =>{
            setDepartments(event)
            }
    
    return (
   <form onSubmit={handleSubmit}>
        <label>
          Department Name:
          </label>
          <DropdownButton variant="warning" onSelect={changeDepartments} id="dropdown-basic-button" title={(Department==='')?"Departments ":Department}>
                {props.Departments.map(Department1 => {
                      return <Dropdown.Item eventKey={Department1}>{Department1}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>
        <br/>
        <label>
          Faculty Name:
          </label>
          <DropdownButton variant="warning" onSelect={changeFaculty} id="dropdown-basic-button" title={(Faculty==='')?"Faculty":Faculty}>
                {props.Faculties.map(Faculty1 => {
                      return <Dropdown.Item eventKey={Faculty1}>{Faculty1}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>        
     <br/>
                <Button variant="success" type="submit"> Add Department  </Button>
      </form>
    )
}
AddDepartment.propTypes = {
  Departments: PropTypes.array,
  Faculties: PropTypes.array
}

AddDepartment.defaultProps = {
  Departments: ['CSEN','DMET','MECHA'],
  Faculties: ["MET","EMS","IET"]
};
export default AddDepartment
