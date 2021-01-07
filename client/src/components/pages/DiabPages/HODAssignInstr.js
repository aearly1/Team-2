import React , {useState, useEffect} from 'react'
import {Container,Alert, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import useToken from '../general/useToken';
import axios from 'axios'


/*
TODOS ==>
    1. Load Courses from DB
        1.1 -> need to make a route to get courses
    2. Load Instructors from DB
        2.1 -> Load staff members then filter the instructors
    3. 
*/

function HODEditCourse(){
    const token = useToken().token

    const [options1,setOptions1]= useState([]);// Load Course Dropdown
    const [options2,setOptions2]= useState([]);// Load Instructor Dropdown
    const [alertext,setAlertext]= useState();
    const [value1,setValue1]= useState(''); // This is the course
    const [value2,setValue2]= useState(''); // This is the instructor
    useEffect(async ()=>{
        //GET THE Courses under department
        await axios.get('http://localhost:5000/api/hod/courses',{headers:{'auth-token':token}}).then((res)=>{
            alert(JSON.stringify(res.data))
            let items = []
            res.data.map(course => {items.push({ courseName:course.courseName})})
            setOptions1(items);
        }).catch(err=>alert(err))

        //GET THE Instructors under department
        await axios.get('http://localhost:5000/api/hod/staff',{headers:{'auth-token':token}}).then((res)=>{
            alert(JSON.stringify(res.data))
            let items = []
            res.data.map(staffMem => 
            {
            if((staffMem.subType=='head of department')||(staffMem.subType=='instructor')){
                items.push({instrId:staffMem.userCode, name:staffMem.name})
            }
            })
            setOptions2(items);
        }).catch(err=>alert(err))

        }, []  )

    const assignInstrReq= ()=> {
        if(value1&&value2){
        axios.get('http://localhost:5000/api/hod/assign-instr-course',{courseName:value1,instructorId: value2},{headers:{'auth-token':token}}).then((res)=>{
            setAlertext(res.data);         
            }).catch(err=>alert(err))
        }
        else{
            setAlertext("Either an Instructor or a course was not chosen.")
        }
    }
    const deleteInstrReq= () => {
        if(value1&&value2){
        axios.get('http://localhost:5000/api/hod/del-instr-course',{courseName:value1,instructorId: value2},{headers:{'auth-token':token}}).then((res)=>{
            setAlertext(res.data);      
            }).catch(err=>alert(err))
        }
        else{
            setAlertext("Either an Instructor or a course was not chosen.")
        }
    }
    const updateInstrReq= () => {
        if(value1&&value2){
        axios.get('http://localhost:5000/api/hod/update-instr-course',{courseName:value1,instructorId: value1},{headers:{'auth-token':token}}).then((res)=>{
            setAlertext(res.data);       
            }).catch(err=>alert(err))
        }
        else{
            setAlertext("Either an Instructor or a course was not chosen.")
        }
    }



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
                  {options1.map(option => {
                      return <Dropdown.Item eventKey={option.courseName}>{option.courseName}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>
            </Form.Group>

            <Form.Group controlId="formInstructor">
                <Form.Label>Instructor:</Form.Label>
                <DropdownButton variant="warning" onSelect={handleSelect2} id="dropdown-basic-button" title={(value2==="")?"Select Instructor":value2}>
                {options2.map(option => {
                      return <Dropdown.Item eventKey={option.instrId}>{option.name}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>
            </Form.Group>

            
            {(alertext)?(<Alert variant ='warning'>{alertext}</Alert>):(<div></div>)}
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
                    <Button variant="success" onClick={assignInstrReq} >Assign </Button>
                </OverlayTrigger>
                                
                {' '}
                    <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip2}
                >
                    <Button variant="info" onClick={deleteInstrReq} >Update </Button>
                </OverlayTrigger>
                
                {' '}
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip3}
                >
                    <Button variant="danger" onClick={updateInstrReq} >Delete </Button>
                </OverlayTrigger>
            </div>
        </Form>
    </Container>
    )
}

export default HODEditCourse
