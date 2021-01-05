import React from "react";
import RowComponent from "./RowComponent"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown, Button, Table} from 'react-bootstrap'

//component for updating and deleting slots
function UpdateDeleteSlot()
{
    const array = [{Day: "TUES", startTime: "8:15 AM", endTime: "10:00 AM", taughtBy: ["Loaa Elzahar","Walid Elhefny"], location: ["C3. 201", "C3. 103", "C6. 204", "C5. 112"]},
    {Day: "WED", startTime: "1:45 AM", endTime: "3:15 PM", taughtBy: ["Loaa Elzahar","Walid Elhefny"], location: ["C3. 201", "C3. 103", "C6. 204", "C5. 112"]},
    {Day: "THURS", startTime: "8:15 AM", endTime: "10:00 AM", taughtBy: ["Loaa Elzahar","Walid Elhefny"], location: ["C3. 201", "C3. 103", "C6. 204", "C5. 112"]}];
    const tableRows= array.map(elem=>
    {
    return <RowComponent 
    day={elem.Day}
    startTime={elem.startTime} 
    endTime={elem.endTime}
    taughtBy={elem.taughtBy}
    location={elem.location}
    />
    })
    return (
    <div>
    <h5>Update and Delete Course Slots</h5>
    <Table style={{textAlign:"center"}} striped bordered hover> 
    <thead>
    <tr>
    <th>Day</th>
    <th>Start Time</th>
    <th>End Time</th>
    <th>Taught by</th>
    <th>Location</th>
    <th>Update Slot</th>
    <th>Delete Slot</th>
    </tr>
    </thead>
    <tbody>
    {tableRows}
    </tbody>
    </Table>
    </div>
);
}
export default UpdateDeleteSlot;