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
    
    var [arr,setArr]= useState(array);
    const cancelClick=(e)=>{
        var array = [...arr]; // make a separate copy of the array
        var index = e.target.id
        array.splice(index, 1);
        setArr(array);
    }
    
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
    {
        arr.map((elem,i)=>
            {
                var details = null;
            if(elem.RequestType=="Replacement")
            {
                details=<ViewReplacementDetailsModal Status= {elem.Status} Sender= {elem.Sender} Reciever={elem.Reciever} RequestType={elem.RequestType} ReplacementSlot={elem.ReplacementSlot}/>
            }
            else if(elem.RequestType=="Change Day Off")
            {
                details=<ViewchangeDayOffDetailsModal Status= {elem.Status} Sender= {elem.Sender} Reciever={elem.Reciever} RequestType={elem.RequestType} DesiredDayOff={elem.DesiredDayOff} Reason={elem.Reason}/>
            }
            else if(elem.RequestType=="Slot Linking")
            {
                details=<ViewSlotLinkingDetails Status= {elem.Status} Sender= {elem.Sender} Reciever={elem.Reciever} RequestType={elem.RequestType} DesiredSlot={elem.DesiredSlot}/>
            }
            else
            {
                details=<ViewLeaveDetailsModal Status= {elem.Status} Sender= {elem.Sender} Reciever={elem.Reciever} RequestType={elem.RequestType} ReplacementStaffName={elem.ReplacementStaffName} RelaventLeaveDocuments= {elem.RelaventLeaveDocuments} Reason= {elem.Reason} StartOfLeave= {elem.StartOfLeave} EndOfLeave= {elem.EndOfLeave}/>
            }
            return(
            <tr>
            <td>{elem.Sender}</td>
            <td>{elem.RequestType}</td>
            <td>{elem.Status}</td>
            <td>{details}</td>
            <td>
                <Button id={i} onClick={cancelClick} variant="danger">Cancel</Button>{' '}
            </td>
            </tr>)
            })
    }
    </tbody>
    </Table>
    </div>
);
}

export default RequestSent;