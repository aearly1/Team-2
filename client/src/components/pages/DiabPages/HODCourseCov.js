import React, {useState} from 'react';
import {Container,Alert, Form, Dropdown,DropdownButton} from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
const StaffCard = styled.div`
  .staffCard{
    width: auto;
    box-shadow: 10px 5px;
  }
`;


function HODCourseCov(props) {   
    const [str,setStr]= useState('');
    const [value1,setValue1]= useState('');
    const handleSelect1=(e)=>{
      setValue1(e);
      //PULL THIS Dynamically from route later
      setStr("Course coverage for course "+e+" is: 30% (needs routing)");
    }
    return (
        <Container fluid >
        <Form>
            <Form.Group controlId="formCourse">
            <Form.Label><h1>  Select a course to view its coverage:</h1></Form.Label>
            <div style = {{whiteSpace: 'nowrap', paddingLeft:10, marginLeft:0}}>
            <DropdownButton className="pb-3" variant="warning" onSelect={handleSelect1} id="dropdown-basic-button" title={(value1==="")?"Select Course":value1}>
              {props.courses.map(course => {
                  return <Dropdown.Item eventKey={course}>{course}</Dropdown.Item>
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
