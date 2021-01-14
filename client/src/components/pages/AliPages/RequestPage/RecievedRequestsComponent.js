import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import {Button, Table} from 'react-bootstrap'
import ViewchangeDayOffDetailsModal from "./ViewchangeDayOffDetailsModal"
import ViewSlotLinkingDetails from "./ViewslotLinkingDetailsModal"
import ViewLeaveDetailsModal from "./ViewLeaveDetailsModal"
import ViewReplacementDetailsModal from "./ViewReplacementDetailsModal"
import TableScrollbar from 'react-table-scrollbar';

function RecievedRequestsTable()
{
    const token = useToken().token

    var[requestList, setRequestList] = useState([]);
    var[arr, setArr] = useState([]);
    var[arr2, setArr2] = useState([]);
    var[arr3, setArr3] = useState([]);

    useEffect(async ()=>{
        const intervalId = setInterval(() => {  
            //loading all requests upon loading the page
        async function changingDayOff()
        {
             axios.get('http://localhost:5000/api/academicMember/recievedRequests',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setArr3(items);
        }).catch(err=>alert(err))}
         changingDayOff();
        }, 5000)
        return () => clearInterval(intervalId); //This is important
        
        }, []  )
        
        //button handlers
        const acceptClick=(e)=>{
            var index = e.target.id
            async function accept()
            {
                await axios.post('http://localhost:5000/api/academicMember/acceptReplacementRequest',{"requestID":index},{headers:{'auth-token':token}}).then((res)=>{
            }).catch(err=>alert(err))}
            accept();
            window.location.reload(true);
        }
        const rejectClick=(e)=>{
            var index = e.target.id
            async function reject()
            {
                await axios.post('http://localhost:5000/api/academicMember/rejectReplacementRequest',{"requestID":index},{headers:{'auth-token':token}}).then((res)=>{
            }).catch(err=>alert(err))}
            reject();
            window.location.reload(true);
        }

    return (
        <div>
        <h5>Requests Recieved from Other Academic Members</h5>
        <TableScrollbar rows={4}>
        <Table style={{textAlign:"center", position: "sticky", top: 0, zIndex: 100,}} striped bordered hover> 
        <thead>
        <tr>
        <th>Sender</th>
        <th>Request Type</th>
        <th>Status</th>
        <th>Request Content</th>
        <th>Accept/Reject</th>
        </tr>
        </thead>
        <tbody > 
        {
            //inserting Diab request rows
            arr3.map
            (
                (request)=>
                {
                    var buttons=null;
                    if(request.Status=="pending")
                    {
                        buttons=(
                        <div>
                        <Button id={request.id} onClick={acceptClick} variant="success">Accept</Button>{' '}
                        <Button id={request.id} onClick={rejectClick} variant="danger">Reject</Button>{' '}
                        </div>)
                    }
                    var details = null;
                    if(request.RequestType=="replacement")
                    {
                        details=<ViewReplacementDetailsModal Status= {request.Status} Sender= {request.Sender} Reciever={request.Reciever} RequestType={request.RequestType} ReplacementSlot={request.ReplacementSlot}/>
                    }
                    else if(request.RequestType=="slot linking")
                    {
                        details=<ViewSlotLinkingDetails Status= {request.Status} Sender= {request.Sender} Reciever={request.Reciever} RequestType={request.RequestType} DesiredSlot={request.DesiredSlot}/>
                    }
                    else if(request.RequestType=="change day off")
                    {
                        details=<ViewchangeDayOffDetailsModal Status= {request.Status} Sender= {request.Sender} Reciever={request.Reciever} RequestType={request.RequestType} DesiredDayOff={request.DesiredDayOff} Reason={request.Reason}/>
                    }
                    else
                    {
                        details=<ViewLeaveDetailsModal Status= {request.Status} Sender= {request.Sender} Reciever={request.Reciever} RequestType={request.RequestType} ReplacementStaffName={request.ReplacementStaffName} RelaventLeaveDocuments= {request.RelaventLeaveDocuments} Reason= {request.Reason} StartOfLeave= {request.StartOfLeave} EndOfLeave= {request.EndOfLeave}/>
                    }
                    return <tr>
                    <td>{request.Sender}</td>
                    <td>{request.RequestType}</td>
                    <td>{request.Status}</td>
                    <td>{details}</td>
                    <td>{buttons}</td>
                    </tr>
                } 
            )
        }  
        </tbody>
        </Table>  
        </TableScrollbar>
        </div>
    )
}

export default RecievedRequestsTable;