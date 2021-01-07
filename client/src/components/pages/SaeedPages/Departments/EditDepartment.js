import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
function EditDepartment(props){

    const handleSubmit = (e1)=> {
        alert('A name was submitted: '+ newFaculty+" " + oldFaculty+" "+Department);
        e1.preventDefault();
        }
        const [newFaculty,setNewFacultyName]= useState('');
        const [oldFaculty,setOldFacultyName]= useState('');
            const [Department,setDepartments]= useState('');
        const changeOldFaculty = (event) =>{
            setOldFacultyName(event)
            }
        
            const changeNewFaculty = (event) =>{
              setNewFacultyName(event)
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
          New Faculty Name:
          </label>
          <DropdownButton variant="warning" onSelect={changeNewFaculty} id="dropdown-basic-button" title={(newFaculty==='')?"Faculty":newFaculty}>
                {props.Faculties.map(Faculty1 => {
                      return <Dropdown.Item eventKey={Faculty1}>{Faculty1}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>        
     <br/>
     <label>
          Old Faculty Name:
          </label>
          <DropdownButton variant="warning" onSelect={changeOldFaculty} id="dropdown-basic-button" title={(oldFaculty==='')?"Faculty":oldFaculty}>
                {props.Faculties.map(Faculty1 => {
                      return <Dropdown.Item eventKey={Faculty1}>{Faculty1}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>        
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
