import React from "react";
import DropDown from "./DropDown"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown, Button, Table} from 'react-bootstrap'

//component for the rows inside the table
function RowComponent(props)
{
    return (
        <tr>
        <td>{props.day}</td>
        <td>{props.startTime}</td>
        <td>{props.endTime}</td>
        <td><DropDown text="Update staff member" array= {props.taughtBy}/></td>
        <td><DropDown text="Delete staff member" array= {props.location}/></td>
        <td>
        <>
        <OverlayTrigger placement="bottom"
            overlay={
                <Tooltip id={`tooltip-${'bottom'}`}>
                By clicking this button, the slot location and the staff member teaching the slot will be updated wth the values selected in the drop down menus. If you want either of the two values to remain the same, do NOT select any of the options in the corresponding drop down menu.
                </Tooltip>
            }
            >
            <Button variant="info">Update</Button>
            </OverlayTrigger>
        </>
        </td>
        <td>
        <>
        <OverlayTrigger placement="bottom"
            overlay={
                <Tooltip id={`tooltip-${'bottom'}`}>
                By clicking this button, the course slot will be deleted.
                </Tooltip>
            }
            >
            <Button variant="danger">Delete</Button>
            </OverlayTrigger>
        </>
        </td>
    
        </tr>
    );
}

export default RowComponent;