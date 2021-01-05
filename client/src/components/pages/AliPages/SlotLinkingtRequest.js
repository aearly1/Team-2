import React from "react"
import {Table, Button,Container, Row, Col, DropdownButton,Dropdown} from 'react-bootstrap'

//component for the rows inside the table
function RowComponent(props)
{
    return (
        <tr>
        <td>{props.day}</td>
        <td>{props.startTime}</td>
        <td>{props.endTime}</td>
        <td>{props.location}</td>
        <td><Button variant="success">Submit</Button></td>
        </tr>
    );
}

//component for updating and deleting slots
function RequestForm()
{
    const array = [{Day: "TUES", startTime: "8:15 AM", endTime: "10:00 AM", location: "C3. 201"},
    {Day: "WED", startTime: "1:45 AM", endTime: "3:15 PM", location: "C3. 103"},
    {Day: "THURS", startTime: "8:15 AM", endTime: "10:00 AM", location:  "C6. 204"}];
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
    <h5>Kindly find bellow the unassigned slots of the course</h5>
    <Table style={{textAlign:"center"}} striped bordered hover> 
    <thead>
    <tr>
    <th>Day</th>
    <th>Start Time</th>
    <th>End Time</th>
    <th>Location</th>
    <th>Request Linking</th>
    </tr>
    </thead>
    <tbody>
    {tableRows}
    </tbody>
    </Table>
    </div>
);
}
function page()
{
    return(
        <div>
            <br></br>
            <RequestForm />
        </div>
    )
}
export default page