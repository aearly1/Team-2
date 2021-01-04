import React, {useState} from 'react';
import {Container, Button,Card , Col, Row, Dropdown, DropdownButton} from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StaffCard = styled.div`
  .staffCard{
    width: auto;
    box-shadow: 10px 5px;
  }
`;


function HODCourseStaff(props) {
    let style1 = {
        background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
        backgroundColor:"#0C0A4A" ,
        color: "white" ,
        borderRadius: 10, 
        boxShadow: "5px 10px 5px #9E9E9E"
    };
    const [value1,setValue1]= useState('');
    const handleSelect=(e)=>{
      setValue1(e)
    }
    return (
        <Container fluid >
        
        <h1>Staff members assigend to {props.course}: </h1>
        {props.staff.map(staffMem => {
            return (
            <StaffCard style ={{paddingTop:20 }} >
                <Card style={style1} >
                <table style={{width: "100%"}}>
                <colgroup>
                    <col span="1" style={{width: "10%"}}/>
                    <col span="1" style={{width: "90%"}}/>
                </colgroup>
                <tbody>
                    <tr>
                    <td >
                    {staffMem.imgLink?( <img style={{borderRadius:10}} width="250" height="250" src={staffMem.imgLink} />):(<img style={{borderRadius:10}} width="250" height="250" src='https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg' />)}
                    </td>
                    <td >
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
                    </td>
                    </tr>
                    </tbody>
                </table>
                
                </Card>
            </StaffCard>
            )
        }
        )}
        </Container>
    )
}
HODCourseStaff.propTypes = {
    staff: PropTypes.array,
    course: PropTypes.string
  }
  
  HODCourseStaff.defaultProps = {
    staff: [
    {
        userCode: "ac-3",
        subType: "instructor",
        email: "MAbuelkheir@guc.edu.eg",
        name: "Mervat Abuelkheir"
    }],
    course: "CSEN 702 - ACL"
  };
  
export default HODCourseStaff
