import React, {useState, useEffect} from 'react';
import {Container,Alert, Form, Dropdown,DropdownButton} from 'react-bootstrap';
import PropTypes from 'prop-types';
import useToken from '../general/useToken';
import axios from 'axios'
import Loading from 'react-loading'

function InstructorCourseCoverage() {   
    const token = useToken().token
    const [str,setStr]= useState('');
    const [value1,setValue1]= useState('');
    const [options1,setOptions1]= useState([]);
    const [loading1,setLoading1]= useState(true); //for dropdown
    const [loading2,setLoading2]= useState(false); //for alert

    useEffect(()=>{
      async function doIt(){
      //GET THE Courses instructor is assigned to
      await axios.get('http://localhost:5000/api/instructor/courses',{headers:{'auth-token':token}}).then((res)=>{
          let items = []
          res.data.map(course => {items.push({ courseName:course.courseName})})
          setLoading1(false);
          setOptions1(items);
      }).catch(err=>console.log(err.response.data))}
      doIt();
      }, []  )


     const handleSelect1= async (e)=>{
      setLoading2(true)
      setValue1(e);
      let url ='http://localhost:5000/api/instructor/view-course-coverage'+'/'+e
      await axios.post(url,{headers:{'auth-token':token}}).then((res)=>{
        setLoading2(false);  
        setStr(res.data); 
              
      }).catch(err=>setStr(err.toString())) 
    }
    return (
        <Container fluid >
        <Form>
            <Form.Group controlId="formCourse">
            <Form.Label><h1 style={{whiteSpace:'nowrap'}}>  Select a course to view its coverage:</h1></Form.Label>
            <div style = {{whiteSpace: 'nowrap', paddingLeft:10, marginLeft:0}}>
            <DropdownButton className="pb-3" variant="warning" onSelect={handleSelect1} id="dropdown-basic-button" title={(value1==="")?"Select Course":value1}>
              {(!loading1)?(
                options1.map(course => {
                  return <Dropdown.Item eventKey={course.courseName}>{course.courseName}</Dropdown.Item>
                    }
                  )):
              ( 
                <div align='center'>
                <Loading type={"bars"} color="#333" height={'20%'} width={'20%'} />
                </div>
              )}
            </DropdownButton>
            
        {(!loading2)?(
          (str==="")?
          (<div></div>)
          :
          ( <Alert  style={{width:'100%', minWidth: '650px'}} variant="info">{str}</Alert>)
          ):
              ( 
                <div align='left'>
                <Loading type={"bars"} color="#333" height={'5%'} width={'5%'} />
                </div>
              )}
        </div>
        </Form.Group>
        </Form>
        </Container>
        )
}
InstructorCourseCoverage.propTypes = {
    courses: PropTypes.string
  }
  
  InstructorCourseCoverage.defaultProps = {
    courses: ["Course 1","Course 2","Course 3" , "Course 4"],
  };
  
export default InstructorCourseCoverage

