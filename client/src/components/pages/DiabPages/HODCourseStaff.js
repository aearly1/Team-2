import React, {useState} from 'react';
import {Container, Button,Card , Col, Row,Form, Dropdown,ButtonGroup, DropdownButton} from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
const StaffCard = styled.div`
  .staffCard{
    width: auto;
    box-shadow: 10px 5px;
  }
`;


function HODCourseStaff(props) {   

    const [value1,setValue1]= useState('');
    const handleSelect1=(e)=>{
      setValue1(e)
    }
    return (
        <Container fluid >
        <Form>
            <Form.Group controlId="formCourse">
            <Form.Label><h1>  Select a course to view its staff members:</h1></Form.Label>
            <div style = {{whiteSpace: 'nowrap', paddingLeft:10, marginLeft:0}}>
            
            <Dropdown as={ButtonGroup} style= {{paddingLeft:30}}>
            <Dropdown.Toggle variant="warning"> {(value1==="")?"Select Course":value1} </Dropdown.Toggle>
            <Dropdown.Menu >
            {props.courses.map(course => {
                //TODO: Need to set this bit to put the course in the payload to the view staff page
                return <Dropdown.Item href="/view-staff">{course}</Dropdown.Item>
            }
        )}
        </Dropdown.Menu>
        </Dropdown>
        </div>
        </Form.Group>
        </Form>
        </Container>
        )
}
HODCourseStaff.propTypes = {
    courses: PropTypes.string
  }
  
  HODCourseStaff.defaultProps = {
    courses: ["Course 1","Course 2","Course 3" , "Course 4"],
  };
  
export default HODCourseStaff
