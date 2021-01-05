import React, {useState} from 'react';
import {Container, Form, Card} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import styled from 'styled-components'
const StaffCard = styled.div`
  .staffCard{
    width: 100%;
    box-shadow: 10px 5px;
  }
`;

const options = [
  { value: 'Slim', label: 'Slim' },
  { value: 'hassan', label: 'Hassan' },
  { value: 'milad', label: 'Milad' },
  { value: 'ahmed', label: 'Ahmed' } 
];

function HODStaffDO(props) {  
let style1 = {
  background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
  backgroundColor:"#0C0A4A" ,
  color: "white" ,
  borderRadius: 10, 
  boxShadow: "5px 10px 5px #9E9E9E",
  minWidth:750,
};


const [rendered,setRendered]= useState(false);
const handleChange=(e)=>{
  setRendered(true)
}

return (
    <Container fluid >
    <h1>Staff Member Day Offs:</h1>
    {props.staff.map(staffMem => {
        return (
        <StaffCard style ={{paddingTop:20 }} >
            <Card style={style1} >
                <Card.Body >
                <Card.Title style ={{fontSize: 30, textDecoration:"underline", textDecorationColor: "#B33F62"}}>{staffMem.staffMemberName} - Needs routing!!!</Card.Title>
                <Card.Text>
                id: {staffMem.id}
                </Card.Text>
                <Card.Text>
                day-off: {staffMem.dayOff}
                </Card.Text>
                <Card.Text>
                type: {staffMem.subType}
                </Card.Text>
                </Card.Body>
            </Card>
        </StaffCard>
        )
    })}
    </Container>
    )
}

HODStaffDO.propTypes = {
    staff: PropTypes.object,
    staffMembers: PropTypes.string
  }
  
HODStaffDO.defaultProps = {
    staff: [
        {
            id: "ac-1",
            staffMemberName: "Slim Abdennadher",
            subType: "head of department",
            dayOff: "SUN",
        },
        {
            id: "ac-2",
            staffMemberName: "Hassan Soubra",
            subType: "instructor",
            dayOff: "SAT"
        },
        {
            id: "ac-3",
            staffMemberName: "Mervat Abuelkheir",
            subType: "instructor",
            dayOff: "SAT",
        }]
  };
  
export default HODStaffDO
