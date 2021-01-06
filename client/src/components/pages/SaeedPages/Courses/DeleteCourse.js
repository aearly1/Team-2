import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import useToken from '../../general/useToken';
import axios from 'axios';

function DeleteCourse(props){
const token = useToken().token

    const handleSubmit = (e1)=> {
      e1.preventDefault();
      axios.post('http://localhost:5000/api/hr/deleteCourse',{'courseName':Course,'oldDepartmentName':oldDepartment},{headers:{'auth-token':token}}).then((res)=>{
      alert(res.data)    
      }).catch(err=>alert(err))  
       }
        const [oldDepartment,setOldDepartment]= useState('');
            const [Course,setCourses]= useState('');
        const changeOldDepartment = (event) =>{
            setOldDepartment(event.target.value)
            }
        
          
                      

        const changeCourses = (event) =>{
            setCourses(event.target.value )
            }
    
    return (
   <form onSubmit={handleSubmit}>
        <label>
          Course Name:
          </label>
          <input type="text" class="form-control" required value={Course} onChange={changeCourses} />
     <br/>
     <label>
         Department Name:
          </label>
          <input type="text" class="form-control" required value={oldDepartment} onChange={changeOldDepartment} />
        
     <br/>
  
                <Button variant="success" type="submit"> Delete Course  </Button>
      </form>
    )
}
DeleteCourse.propTypes = {
  Courses: PropTypes.array,
  Departments: PropTypes.array
}

DeleteCourse.defaultProps = {
  Courses: ['csen301','csen401','csen104'],
  Departments: ['CSEN','DMET','MECHA']
};
export default DeleteCourse
