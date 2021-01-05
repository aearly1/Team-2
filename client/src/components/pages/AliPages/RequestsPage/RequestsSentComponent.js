import React , {useState} from "react"
import ReplacementSlot from "./ReplacementRequests"
import SlotLinkingtRequest from "./SlotLinkingtRequests"
import ChangeDayOfftRequest from "./ChangeDayOffRequests"
import LeavesRequests from "./LeavesRequests"
import ButtonSection from "./ButtonSection"
import ViewchangeDayOffDetailsModal from "./ViewchangeDayOffDetailsModal"
import ViewSlotLinkingDetails from "./ViewslotLinkingDetailsModal"
import ViewLeaveDetailsModal from "./ViewLeaveDetailsModal"
import ViewReplacementDetailsModal from "./ViewReplacementDetailsModal"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

//component for updating and deleting slots
function RequestSent()
{
    const array = [{Sender: "Loaa Elzahar", Reciever:"Walid ElHefny", Status: "Pending", RequestType: "Replacement", ReplacementSlot:{StartTime: "08:15.000Z",EndTime: "09:45.000Z",CourseTaughtInSlot: "CSEN701: Embedded Systems", SlotLocation: "H14"}},
    {Sender: "Walid Elhefny", Reciever:"Loaa Elzahar", Status: "Pending", RequestType: "Change Day Off", DesiredDayOff: "SAT", Reason: "I love eating chocolate cake on Sataurday and I can't eat chocolate cake at uni"},
    {Sender: "Loaa Elzahar", Reciever:"Walid ElHefny", Status: "Pending", RequestType: "Slot Linking", DesiredSlot:{StartTime: "08:15.000Z",EndTime: "09:45.000Z",CourseTaughtInSlot: "CSEN701: Embedded Systems", SlotLocation: "H14"}},
    {Sender: "Walid Elhefny", Reciever:"Loaa Elzahar", Status: "Pending", RequestType: "Sick Leave", ReplacementStaffName: "Loaa Elzahar", RelaventLeaveDocuments: "https://drive.google.com/file/d/1soJJpBRjlzuVOs8GsGv5lbeLUP3k6MwK/view?usp=sharing", Reason: "I love eating chocolate cake on Sataurday and I can't eat chocolate cake at uni", StartOfLeave: "01.02.2012", EndOfLeave: "01.02.2012"}];
    const tableRows= array.map(elem=>
    {
    return <RowComponentOfSentTable 
    element={elem}
    />
    })
    return (
    <div>
    <h5>Requests Sent To Other Academic Members</h5>
    <Table style={{textAlign:"center"}} striped bordered hover> 
    <thead>
    <tr>
    <th>Recipient</th>
    <th>Request Type</th>
    <th>Status</th>
    <th>Request Content</th>
    <th>Cancel Request</th>

    </tr>
    </thead>
    <tbody>
    {tableRows}
    </tbody>
    </Table>
    </div>
);
}

//component for the rows inside the first table
function RowComponentOfSentTable(props)
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
            <Button variant="danger">Cancel</Button>{' '}
        </td>
        </tr>
    );
}


export default RequestSent;