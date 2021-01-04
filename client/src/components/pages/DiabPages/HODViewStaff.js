import React, {useState} from 'react';
import {Container, Button,Card , Col, Row, Dropdown,ButtonGroup, DropdownButton} from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StaffCard = styled.div`
  .staffCard{
    width: 100%;
    box-shadow: 10px 5px;
  }
`;

const custDropDown = styled.div`
  .dropdown-link a{
    background: red; color: yellow; !important;
  }
`
//<DropdownButton  variant="primary" onSelect={handleSelect} className="dropdown-link" title={(value1==="")?"Select Course":value1} style={style2}>
       
function HODViewStaff(props) {
    let style1 = {
        background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
        backgroundColor:"#0C0A4A" ,
        color: "white" ,
        borderRadius: 10, 
        boxShadow: "5px 10px 5px #9E9E9E",
        minWidth:750,
    };
    
    const [value1,setValue1]= useState('');
    const [path1,setPath1]= useState('');
    const handleSelect1=(e)=>{
      setValue1(e)
    }
    return (
        
        <Container fluid >
        
        <h1 style = {{whiteSpace: 'nowrap'}}>Staff members in your department: </h1>
        <div style = {{whiteSpace: 'nowrap', paddingLeft:0, marginLeft:0}}>
        <strong style = {{whiteSpace: 'nowrap'}}>View staff for specific course instead:</strong>
        
        <Dropdown as={ButtonGroup} style= {{paddingLeft:30}}>
        <Dropdown.Toggle variant="warning"> {(value1==="")?"Select Course":value1} </Dropdown.Toggle>
        <Dropdown.Menu >
        {props.courses.map(course => {
                return <Dropdown.Item eventKey={course}>{course}</Dropdown.Item>
            }
            )}
        </Dropdown.Menu>
            
        
        </Dropdown>
        <Button variant="secondary" style={{width:"100"}} href={'/course-staff'}>View</Button>
        </div>
        {props.staff.map(staffMem => {
            return (
            <StaffCard style ={{paddingTop:20 }} >
                <Card style={style1} >
                <Container fluid className="ml-0 pl-0">
                <Row>
                <Col md={4}>
                    <img style={{borderRadius:10}} width="250" height="250" src={staffMem.imgLink} alt ="img not found"/>
                </Col>
                <Col md= {8}>
                <Card.Body >
                    <Card.Title style ={{fontSize: 30, textDecoration:"underline", textDecorationColor: "#B33F62"}}>{staffMem.name}</Card.Title>
                    <Card.Text>
                    Type: {staffMem.subType}
                    </Card.Text>
                    <Card.Text>
                    id: {staffMem.userCode}
                    </Card.Text>
                    <Card.Text>
                   Email: {staffMem.email}
                    </Card.Text>
                    <Button variant="warning" href="#">Visit profile (needs routing)</Button>
                </Card.Body>
                </Col>
                
                </Row>
                </Container>
                </Card>
            </StaffCard>
            )
        }
        )}
        </Container>
    )
}
HODViewStaff.propTypes = {
    staff: PropTypes.array,
    courses: PropTypes.array
  }
  
  HODViewStaff.defaultProps = {
    staff: [
    {
        userCode: "ac-1",
        imgLink: "https://met.guc.edu.eg/Repository/Faculty/Photos/Thumbnail/1_Slim_Abdennadher_thumbnail_Slim.jpg.ashx",
        subType: "head of department",
        email: "Slim@guc.edu.eg",
        name: "Slim Abdennadher"
    },
    {
        userCode: "ac-2",
        imgLink: "https://met.guc.edu.eg/Repository/Faculty/Photos/Thumbnail/3_Haythem_Ismail_thumbnail_JESICS3.JPG.ashx",
        subType: "instructor",
        email: "HIsmail@guc.edu.eg",
        name: "Haythem Ismail"
    },
    {
        userCode: "ac-3",
        subType: "instructor",
        email: "MAbuelkheir@guc.edu.eg",
        name: "Mervat Abuelkheir"
    }],
    courses: ["Course 1","Course 2","Course 3"]
  };
  
export default HODViewStaff
