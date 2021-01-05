import React , {useState} from "react"
import ViewchangeDayOffDetailsModal from "./ViewchangeDayOffDetailsModal"
import ViewSlotLinkingDetails from "./ViewslotLinkingDetailsModal"
import ViewLeaveDetailsModal from "./ViewLeaveDetailsModal"
import ViewReplacementDetailsModal from "./ViewReplacementDetailsModal"

import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

//component for updating and deleting slots
function RequestReceived()
{
    const array = [{Sender: "Loaa Elzahar", Reciever:"Walid ElHefny", Status: "Pending", RequestType: "Replacement", ReplacementSlot:{StartTime: "08:15.000Z",EndTime: "09:45.000Z",CourseTaughtInSlot: "CSEN701: Embedded Systems", SlotLocation: "H14"}},
    {Sender: "Walid Elhefny", Reciever:"Loaa Elzahar", Status: "Pending", RequestType: "Change Day Off", DesiredDayOff: "SAT", Reason: "I love eating chocolate cake on Sataurday and I can't eat chocolate cake at uni"},
    {Sender: "Loaa Elzahar", Reciever:"Walid ElHefny", Status: "Pending", RequestType: "Slot Linking", DesiredSlot:{StartTime: "08:15.000Z",EndTime: "09:45.000Z",CourseTaughtInSlot: "CSEN701: Embedded Systems", SlotLocation: "H14"}},
    {Sender: "Walid Elhefny", Reciever:"Loaa Elzahar", Status: "Pending", RequestType: "Sick Leave", ReplacementStaffName: "Loaa Elzahar", RelaventLeaveDocuments: "https://drive.google.com/file/d/1soJJpBRjlzuVOs8GsGv5lbeLUP3k6MwK/view?usp=sharing", Reason: "I love eating chocolate cake on Sataurday and I can't eat chocolate cake at uni", StartOfLeave: "01.02.2012", EndOfLeave: "01.02.2012"}];
    const tableRows= array.map(elem=>
    {
    return <RowComponentOfRecievedTable 
    element={elem}
    />
    })
    return (
    <div>
    <h5>Requests Recieved from Other Academic Members</h5>
    <Table style={{textAlign:"center"}} striped bordered hover> 
    <thead>
    <tr>
    <th>Sender</th>
    <th>Request Type</th>
    <th>Status</th>
    <th>Request Content</th>
    <th>Accept/Reject</th>

    </tr>
    </thead>
    <tbody>
    {tableRows}
    </tbody>
    </Table>
    </div>
);
}

//component for the rows inside the second table
function RowComponentOfRecievedTable(props)
{
    var details = null;
    if(props.element.RequestType=="Replacement")
    {
        details=<ViewReplacementDetailsModal Status= {props.element.Status} Sender= {props.element.Sender} Reciever={props.element.Reciever} RequestType={props.element.RequestType} ReplacementSlot={props.element.ReplacementSlot}/>
    }
    else if(props.element.RequestType=="Change Day Off")
    {
        details=<ViewchangeDayOffDetailsModal Status= {props.element.Status} Sender= {props.element.Sender} Reciever={props.element.Reciever} RequestType={props.element.RequestType} DesiredDayOff={props.element.DesiredDayOff} Reason={props.element.Reason}/>
    }
    else if(props.element.RequestType=="Slot Linking")
    {
        details=<ViewSlotLinkingDetails Status= {props.element.Status} Sender= {props.element.Sender} Reciever={props.element.Reciever} RequestType={props.element.RequestType} DesiredSlot={props.element.DesiredSlot}/>
    }
    else
    {
        details=<ViewLeaveDetailsModal Status= {props.element.Status} Sender= {props.element.Sender} Reciever={props.element.Reciever} RequestType={props.element.RequestType} ReplacementStaffName={props.element.ReplacementStaffName} RelaventLeaveDocuments= {props.element.RelaventLeaveDocuments} Reason= {props.element.Reason} StartOfLeave= {props.element.StartOfLeave} EndOfLeave= {props.element.EndOfLeave}/>
    }
    return (
        <tr>
        <td>{props.element.Sender}</td>
        <td>{props.element.RequestType}</td>
        <td>{props.element.Status}</td>
        <td>{details}</td>
        <td>
            <Button variant="success">Accept</Button>{' '}
            <Button variant="danger">Reject</Button>{' '}
        </td>
        </tr>
    );
}

export default RequestReceived;