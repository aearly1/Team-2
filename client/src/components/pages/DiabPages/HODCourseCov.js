import React, {useState, useEffect} from 'react';
import {Container,Alert, Form, Dropdown,DropdownButton} from 'react-bootstrap';
import PropTypes from 'prop-types';
import useToken from '../general/useToken';
import axios from 'axios'

function HODCourseCov(props) {   
    const token = useToken().token
    const [str,setStr]= useState('');
    const [value1,setValue1]= useState('');
    const [options1,setOptions1]= useState([]);

    useEffect(()=>{
      async function doIt(){
      //GET THE Courses under department
      await axios.get('http://localhost:5000/api/hod/courses',{headers:{'auth-token':token}}).then((res)=>{
          let items = []
          res.data.map(course => {items.push({ courseName:course.courseName})})
          setOptions1(items);
      }).catch(err=>alert(err))}
      doIt();
      }, []  )


     const handleSelect1= (e)=>{
      setValue1(e);
      axios.post('http://localhost:5000/api/hod/course-cov',{courseName:e},{headers:{'auth-token':token}}).then((res)=>{
       setStr(res.data);         
      }).catch(err=>setStr(err.toString())) 
    }
    return (
        <Container fluid >
        <Form>
            <Form.Group controlId="formCourse">
            <Form.Label><h1>  Select a course to view its coverage:</h1></Form.Label>
            <div style = {{whiteSpace: 'nowrap', paddingLeft:10, marginLeft:0}}>
            <DropdownButton className="pb-3" variant="warning" onSelect={handleSelect1} id="dropdown-basic-button" title={(value1==="")?"Select Course":value1}>
              {options1.map(course => {
                  return <Dropdown.Item eventKey={course.courseName}>{course.courseName}</Dropdown.Item>
              }
            )}
            </DropdownButton>
            
        {(str==="")?(<div></div>):( <Alert  style={{maxWidth:'900'}} variant="info">{str}</Alert>)}
        </div>
        </Form.Group>
        </Form>
        </Container>
        )
}
  HODCourseCov.propTypes = {
    courses: PropTypes.string
  }
  
  HODCourseCov.defaultProps = {
    courses: ["Course 1","Course 2","Course 3" , "Course 4"],
  };
  
export default HODCourseCov
