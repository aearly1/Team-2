import React from "react";
import {Container, Col, Row, DropdownButton, Dropdown, Button, Table} from 'react-bootstrap'
//Component for create slots
function CreateSlot()
{
    const timing=["8:15 AM - 9:45 AM", "10:00 AM - 11:30 AM", "11:45 AM - 1:15 AM", "1:45 AM - 3:15 AM", "3:45 AM - 5:15 AM"];
    const location=["C3. 201", "C3. 103", "C6. 204", "C5. 112"];
    return (
    <div>
      <h5>Create Course Slot</h5>
      <p>Slot timing</p>
      <DropDown text="Select Slot timing" array= {timing}/>
      <br></br>
      <p>Location</p>
      <DropDown text="Select Location" array= {location}/>
      <br></br>

      <Button variant="success">Create</Button>
    </div>)
}

//component for the dropdown inside the rows
function DropDown(props)
{
    const array = props.array
    const items= array.map(elem=>
    {
        return <Dropdown.Item href="#/action-1">{elem}</Dropdown.Item>
    })
    return(
        <DropdownButton id="dropdown-basic-button" variant="warning" title={props.text}>
        {items}
        </DropdownButton>
    )
}
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
        <td><Button variant="info">Update</Button>{' '}</td>
        <td><Button variant="danger">Cancel</Button></td>
        </tr>
    );
}

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
//slot page component
function Slot()
{
    return (<div>
        <h1>Manage Course Slots</h1>
        <br></br>
        <Container>
        <Row>
            <Col><CreateSlot /></Col>
            <Col> <UpdateDeleteSlot /></Col>
        </Row>
        </Container>
        
        </div>);
}

export default Slot;