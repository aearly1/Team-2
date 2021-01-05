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
function Notifiactions()
{
    const array = [{status: "accepted", message: "Walid ElHefny accepted your slot linking request"}, {status: "rejected", message:"Hassan Soubra rejected your sick leave request"}, {status: "accepted", message: "Walid ElHefny accepted your replacement request"}]
   
    const tableRows= array.map(elem=>
    {
        var color=elem.status=="accepted"?"#5cb85c":"#d9534f";
    return (
    <tr style={{backgroundColor: color, color:"white"}}><td>{elem.message}</td></tr>
    )})
    return (
    <div>
    <h5>  </h5>
    <Table style={{textAlign:"center"}} striped bordered hover> 
    <thead>
    <tr>
    <th>Notifications</th>
    </tr>
    </thead>
    <tbody style={{display: "block", height: 650, overflow: "scroll"}}>
    {tableRows}
    </tbody>
    </Table>
    </div>
);
}

export default Notifiactions