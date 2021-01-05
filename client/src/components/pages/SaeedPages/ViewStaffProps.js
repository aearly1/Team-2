import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { propTypes } from 'react-bootstrap/esm/Image';
function ViewAttendance(props){

  const renderTooltip1 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        View the attendance of the staff member with the selected id
    </Tooltip>
    );
    const renderTooltip2 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        View missing days and hours of the staff member with the selected id   
         </Tooltip>
    );
    const renderTooltip3 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
              View the Salary after deductions of the staff member with the selected id
    </Tooltip>
    );


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
                    <Button variant="success" type="submit">View Attendance </Button>
                </OverlayTrigger>
                                
                {' '}
                    <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip2}
                >
                    <Button variant="info" type="submit"> View Missing Days </Button>
                </OverlayTrigger>
                
                {' '}
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip3}
                >
                    <Button variant="danger" type="submit">View Salary  </Button>
                </OverlayTrigger>
      </form>
    )
}
/*
    check("office", "Staff member office must be a string").isString(),
    check("departmentName", "Staff member department must be a string").optional().isString(),
    check("facultyName", "Staff member faculty must be a string").optional().isString(),
*/
ViewAttendance.propTypes = {
  IDs:PropTypes.array,
}

ViewAttendance.defaultProps = {
  IDs:["ac-1","hr-1"]
};
export default ViewAttendance