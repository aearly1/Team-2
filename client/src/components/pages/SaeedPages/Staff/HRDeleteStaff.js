import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { propTypes } from 'react-bootstrap/esm/Image';
function DeleteStaff(props){

    const handleSubmit = (e1)=> {
        alert('A name was submitted: ' + Id);
        e1.preventDefault();
        }
           
            const [Id,setID]= useState('');
 
            const changeID = (event) =>{
            setID(event)
            }

    return (
   <form onSubmit={handleSubmit}>
         <label>
          Staff Member ID:
          </label>
          <DropdownButton variant="warning" onSelect={changeID} id="dropdown-basic-button" title={(Id==='')?"Staff Member ID":Id}>
                {props.IDs.map(id => {
                      return <Dropdown.Item eventKey={id}>{id}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     
                <br/>

                <Button variant="danger" type="submit"> Delete Staff Member  </Button>

      </form>
    )
}
/*
    check("office", "Staff member office must be a string").isString(),
    check("departmentName", "Staff member department must be a string").optional().isString(),
    check("facultyName", "Staff member faculty must be a string").optional().isString(),
*/
DeleteStaff.propTypes = {
  IDs:PropTypes.array,

}

DeleteStaff.defaultProps = {
  IDs:["ac-1","hr-1"]
};
export default DeleteStaff
