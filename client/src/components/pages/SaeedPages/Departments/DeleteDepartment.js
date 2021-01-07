import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
function DeleteDepartment(props){

    const handleSubmit = (e1)=> {
        alert('A name was submitted: ' + oldFaculty+" "+Department);
        e1.preventDefault();
        }
        const [oldFaculty,setOldFacultyName]= useState('');
            const [Department,setDepartments]= useState('');
        const changeOldFaculty = (event) =>{
            setOldFacultyName(event)
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
          <DropdownButton variant="warning" onSelect={changeOldFaculty} id="dropdown-basic-button" title={(oldFaculty==='')?"Faculty":oldFaculty}>
                {props.Faculties.map(Faculty1 => {
                      return <Dropdown.Item eventKey={Faculty1}>{Faculty1}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>        
     <br/>
                <Button variant="danger" type="submit"> Delete Department  </Button>
      </form>
    )
}
DeleteDepartment.propTypes = {
  Departments: PropTypes.array,
  Faculties: PropTypes.array
}

DeleteDepartment.defaultProps = {
  Departments: ['CSEN','DMET','MECHA'],
  Faculties: ["MET","EMS","IET"]
};
export default DeleteDepartment
