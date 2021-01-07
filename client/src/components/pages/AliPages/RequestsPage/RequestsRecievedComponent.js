import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import ViewchangeDayOffDetailsModal from "./ViewchangeDayOffDetailsModal"
import ViewSlotLinkingDetails from "./ViewslotLinkingDetailsModal"
import ViewLeaveDetailsModal from "./ViewLeaveDetailsModal"
import ViewReplacementDetailsModal from "./ViewReplacementDetailsModal"

import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

//component for updating and deleting slots
function RequestReceived()
{
    const token = useToken().token

    var [arr,setArr]= useState([]);
    useEffect(async ()=>{
        async function Replacement()
        {
            await axios.get('http://localhost:5000/api/academicMember/replacementRequest',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setArr( [...arr, ...items]);
        }).catch(err=>alert(err))}
        await Replacement();
       async function SlotLinking()
        {
            await axios.get('http://localhost:5000/api/coordinator/slotLinkingRequest',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setArr( [...arr, ...items]);
        }).catch(err=>alert(err))}
        SlotLinking();
        /* async function doIt2()
        {
            await axios.get('http://localhost:5000/api/coordinator/slotLinkingRequest',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setArr(items);
        }).catch(err=>alert(err))}
        await doIt2();*/
        /* async function doIt2()
        {
            await axios.get('http://localhost:5000/api/coordinator/slotLinkingRequest',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setArr(items);
        }).catch(err=>alert(err))}
        await doIt2();*/
        }, []  )
    const array = [{Sender: "Loaa Elzahar", Reciever:"Walid ElHefny", Status: "Pending", RequestType: "Replacement", ReplacementSlot:{StartTime: "08:15.000Z",EndTime: "09:45.000Z",CourseTaughtInSlot: "CSEN701: Embedded Systems", SlotLocation: "H14"}},
    {Sender: "Walid Elhefny", Reciever:"Loaa Elzahar", Status: "Pending", RequestType: "Change Day Off", DesiredDayOff: "SAT", Reason: "I love eating chocolate cake on Sataurday and I can't eat chocolate cake at uni"},
    {Sender: "Loaa Elzahar", Reciever:"Walid ElHefny", Status: "Pending", RequestType: "Slot Linking", DesiredSlot:{StartTime: "08:15.000Z",EndTime: "09:45.000Z",CourseTaughtInSlot: "CSEN701: Embedded Systems", SlotLocation: "H14"}},
    {Sender: "Walid Elhefny", Reciever:"Loaa Elzahar", Status: "Pending", RequestType: "Sick Leave", ReplacementStaffName: "Loaa Elzahar", RelaventLeaveDocuments: "https://drive.google.com/file/d/1soJJpBRjlzuVOs8GsGv5lbeLUP3k6MwK/view?usp=sharing", Reason: "I love eating chocolate cake on Sataurday and I can't eat chocolate cake at uni", StartOfLeave: "01.02.2012", EndOfLeave: "01.02.2012"}];

    const acceptClick=(e)=>{
        var array = [...arr]; // make a separate copy of the array
        var index = e.target.id
        array[index].Status="Accepted";
        setArr(array);
    }
    const rejectClick=(e)=>{
        var array = [...arr]; // make a separate copy of the array
        var index = e.target.id
        array[index].Status="Rejected";
        setArr(array);
    }
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
    {
    arr.map((elem,i)=>
    {
        var details = null;
    if(elem.RequestType=="replacement")
    {
        details=<ViewReplacementDetailsModal Status= {elem.Status} Sender= {elem.Sender} Reciever={elem.Reciever} RequestType={elem.RequestType} ReplacementSlot={elem.ReplacementSlot}/>
    }
    else if(elem.RequestType=="Change Day Off")
    {
        details=<ViewchangeDayOffDetailsModal Status= {elem.Status} Sender= {elem.Sender} Reciever={elem.Reciever} RequestType={elem.RequestType} DesiredDayOff={elem.DesiredDayOff} Reason={elem.Reason}/>
    }
    else if(elem.RequestType=="slot linking")
    {
        details=<ViewSlotLinkingDetails Status= {elem.Status} Sender= {elem.Sender} Reciever={elem.Reciever} RequestType={elem.RequestType} DesiredSlot={elem.DesiredSlot}/>
    }
    else
    {
        details=<ViewLeaveDetailsModal Status= {elem.Status} Sender= {elem.Sender} Reciever={elem.Reciever} RequestType={elem.RequestType} ReplacementStaffName={elem.ReplacementStaffName} RelaventLeaveDocuments= {elem.RelaventLeaveDocuments} Reason= {elem.Reason} StartOfLeave= {elem.StartOfLeave} EndOfLeave= {elem.EndOfLeave}/>
    }
    var buttons=null;
    if(elem.Status=="pending")
    {
        buttons=(
        <div>
        <Button id={i} onClick={acceptClick} variant="success">Accept</Button>{' '}
        <Button id={i} onClick={rejectClick}  variant="danger">Reject</Button>{' '}
        </div>)
    }
    return(
        <tr>
        <td>{elem.Sender}</td>
        <td>{elem.RequestType}</td>
        <td>{elem.Status}</td>
        <td>{details}</td>
        <td>
            {buttons}
        </td>
    </tr>
    )
    })
    }
    </tbody>
    </Table>
    </div>
);
}

export default RequestReceived;