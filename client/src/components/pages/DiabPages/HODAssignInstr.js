import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
function HODEditCourse(props){

    const [value1,setValue1]= useState('');
    const [value2,setValue2]= useState('');
    
    const handleSelect1=(e)=>{
      setValue1(e)
    }
    const handleSelect2=(e)=>{
        setValue2(e)
      }
    const renderTooltip1 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        The chosen <strong> instructor </strong> will be <strong> assigned</strong>  to the chosen <strong> course</strong>.
    </Tooltip>
    );
    const renderTooltip2 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        The chosen <strong> instructor</strong>  will <strong> overwrite</strong>  all other instructors for the chosen <strong> course</strong>.
    </Tooltip>
    );
    const renderTooltip3 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        The chosen <strong> instructor</strong>  will be <strong> un-assigned </strong> from the chosen <strong> course</strong>.
    </Tooltip>
    );
    return (
    <Container fluid>
        <Form>
            <Form.Group controlId="formCourse">
                <Form.Label>Course:</Form.Label>
                <DropdownButton variant="warning" onSelect={handleSelect1} id="dropdown-basic-button" title={(value1==="")?"Select Course":value1}>
                  {props.courses.map(course => {
                      return <Dropdown.Item eventKey={course}>{course}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>
            </Form.Group>

            <Form.Group controlId="formInstructor">
                <Form.Label>Instructor:</Form.Label>
                <DropdownButton variant="warning" onSelect={handleSelect2} id="dropdown-basic-button" title={(value2==="")?"Select Instructor":value2}>
                {props.instructors.map(instructor => {
                      return <Dropdown.Item eventKey={instructor}>{instructor}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>
            </Form.Group>

            

            <div style = {{paddingTop: 20}}>
                <hr  style={{
                    color: '#0C0A3E',
                    backgroundColor: '#0C0A3E',
                    height: 1,
                    borderColor : '#0C0A3E'
                }}/>
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip1}
                >
                    <Button variant="success" type="submit">Assign </Button>
                </OverlayTrigger>
                                
                {' '}
                    <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip2}
                >
                    <Button variant="info" type="submit">Update </Button>
                </OverlayTrigger>
                
                {' '}
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip3}
                >
                    <Button variant="danger" type="submit">Delete </Button>
                </OverlayTrigger>
            </div>
        </Form>
    </Container>
    )
}
HODEditCourse.propTypes = {
    courses: PropTypes.array,
    instructors: PropTypes.array
}

HODEditCourse.defaultProps = {
    courses: ["Course 1","Course 2","Course 3" , "Course 4"],
    instructors: ['Hassan','Instructor 2','Instructor 3', 'Instructor 4'],
  };
export default HODEditCourse
