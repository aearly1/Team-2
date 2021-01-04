import React, {useState} from 'react';
import {Container,Alert, Form, Dropdown,DropdownButton} from 'react-bootstrap';
import PropTypes from 'prop-types';

function HODStaffDOS(props) {   
    const [value1,setValue1]= useState('');
    const handleSelect1=(e)=>{
      setValue1(e);
    }
    return (
        <Container fluid >
        <Form>
            <Form.Group controlId="formStaffMem">
            <Form.Label><h1>  Select a staff member to view his day off:</h1></Form.Label>
            <div style = {{whiteSpace: 'nowrap', paddingLeft:10, marginLeft:0}}>
            <DropdownButton className="pb-3" variant="warning" onSelect={handleSelect1} id="dropdown-basic-button" title={(value1==="")?"Select Staff Member":value1}>
              {props.staffMembers.map(staffMem => {
                  return <Dropdown.Item eventKey={staffMem}>{staffMem}</Dropdown.Item>
              }
            )}
            </DropdownButton>
         </div>
        </Form.Group>
        </Form>
        </Container>
        )
}
  HODStaffDOS.propTypes = {
    staffMembers: PropTypes.string
  }
  
  HODStaffDOS.defaultProps = {
    staffMembers: ["Staff Member 1","Staff Member 2","Staff Member 3" , "Staff Member 4"],
  };
  
export default HODStaffDOS
