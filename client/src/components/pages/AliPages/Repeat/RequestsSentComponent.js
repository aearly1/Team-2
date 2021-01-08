import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'
import ViewchangeDayOffDetailsModal from "./ViewchangeDayOffDetailsModal"
import ViewSlotLinkingDetails from "./ViewslotLinkingDetailsModal"
import ViewLeaveDetailsModal from "./ViewLeaveDetailsModal"
import ViewReplacementDetailsModal from "./ViewReplacementDetailsModal"

function SentRequestsTable()
{
    const token = useToken().token
    
    const [value1,setValue1]= useState("Select appropiate value");

    const [arr,setArr]= useState([]);

    const handleSelect1=(e)=>{
        setValue1(e)
    }
    const handleSelectStatus=()=>{
        async function select()
        {
            if(value1=="View all requests")
            {
                await axios.get('http://localhost:5000/api/academicMember/requestStatus',{headers:{'auth-token':token}}).then((res)=>{
                let items=res.data;
                setArr(items);
                }).catch(err=>alert(err))
            }
            else if(value1=="View accepted requests")
            {
                await axios.get('http://localhost:5000/api/academicMember/requestStaus/accepted',{headers:{'auth-token':token}}).then((res)=>{
                    let items=res.data;
                    setArr(items);
                }).catch(err=>alert(err))
            }
            else if(value1=="View rejected requests")
            {
                await axios.get('http://localhost:5000/api/academicMember/requestStaus/rejected',{headers:{'auth-token':token}}).then((res)=>{
                    let items=res.data;
                    setArr(items);
                }).catch(err=>alert(err))
            }
            else if(value1=="View pending requests")
            {
                await axios.get('http://localhost:5000/api/academicMember/requestStaus/pending',{headers:{'auth-token':token}}).then((res)=>{
                    let items=res.data;
                    setArr(items);
                }).catch(err=>alert(err))
            }          
        }
        select();
    }
    const handleCancel=(e)=>{
        var index = e.target.id
            async function cancel()
            {
                await axios.post('http://localhost:5000/api/academicMember/cancleRequest',{"requestID":index},{headers:{'auth-token':token}}).then((res)=>{
            }).catch(err=>alert(err))}
            cancel();
    }

    return (
    <div>
    <h5>Requests Sent To Other Academic Members</h5>
    <br></br>
    <Container fluid>
        <Row>
            <Col className="col-3">
            <DropdownButton onSelect={handleSelect1} variant="warning" id="dropdown-basic-button" title={value1}>
            <Dropdown.Item eventKey={"View all sent requests"}>View all sent requests</Dropdown.Item>
            <Dropdown.Item eventKey={"View accepted requests"}>View accepted requests</Dropdown.Item>
            <Dropdown.Item eventKey={"View pending requests"}>View pending requests</Dropdown.Item>
            <Dropdown.Item eventKey={"View rejected requests"}>View rejected requests</Dropdown.Item>
            </DropdownButton>      
            </Col>
            <Button onClick={handleSelectStatus} variant="success">Select</Button>{' '}
            <Col>
            </Col>
        </Row>
        </Container>
    
    <br></br>

    <Table style={{textAlign:"center"}} striped bordered hover> 
    <thead>
    <tr>
    <th>Recipient</th>
    <th>Request Type</th>
    <th>Status</th>
    <th>Cancel Request</th>
    </tr>
    </thead>
    <tbody>
    {
            //inserting replacement request rows
            arr.map
            (
                (request)=>
                {
                    var button=null;
                    const dato= new Date()
                    if(request.status=="pending" && new Date(request.date)>=dato)
                    {
                        button=(<Button onClick={handleCancel} id={request.id} variant="danger">Cancel</Button>)
                    }
                    return <tr>
                    <td>{request.sender}</td>
                    <td>{request.requestType}</td>
                    <td>{request.status}</td>
                    <td>{button}</td>
                    </tr>
                } 
            )
        }
    </tbody>
    </Table>
    </div>
    )
}

export default SentRequestsTable;