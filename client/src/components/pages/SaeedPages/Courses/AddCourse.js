import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
function AddCourse(props){

    const handleSubmit = (e1)=> {
        alert('A name was submitted: ' + Department+" "+Course);
        e1.preventDefault();
        }
            const [Department,setDepartmentName]= useState('');
            const [Course,setCourses]= useState('');
        const changeDepartment = (event) =>{
            setDepartmentName(event)
            }
        
        const changeCourses = (event) =>{
            setCourses(event)
            }
    
    return (
   <form onSubmit={handleSubmit}>
        <label>
          Course Name:
          </label>
          <DropdownButton variant="warning" onSelect={changeCourses} id="dropdown-basic-button" title={(Course==='')?"Course":Course}>
                {props.Courses.map(course => {
                      return <Dropdown.Item eventKey={course}>{course}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>
        <br/>
        <label>
          Department Name:
          </label>
          <DropdownButton variant="warning" onSelect={changeDepartment} id="dropdown-basic-button" title={(Department==='')?"Department":Department}>
                {props.Departments.map(department => {
                      return <Dropdown.Item eventKey={department}>{department}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>        
     <br/>
                <Button variant="success" type="submit"> Add Course </Button>
      </form>
    )
}
AddCourse.propTypes = {
  Courses: PropTypes.array,
  Departments: PropTypes.array
}

AddCourse.defaultProps = {
  Courses: ['csen301','csen401','csen104'],
  Departments: ['CSEN','DMET','MECHA']
};
export default AddCourse
