import React , {useState} from "react"
import ReplacementSlot from "./ReplacementRequests"
import SlotLinkingtRequest from "./SlotLinkingtRequest"
import ChangeDayOfftRequest from "./ChangeDayOff"
import LeavesRequests from "./Leaves"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

function ButtonSection() {
    const [lgShow, setLgShow] = useState(false);
    const [lgShow2, setLg2Show] = useState(false);
    const [lgShow3, setLg3Show] = useState(false);
    const [lgShow4, setLg4Show] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setLgShow(true)}>Submit Replacement Request</Button>{' '}
        <Button variant="danger" onClick={() => setLg2Show(true)}>Submit Slot Linking Request</Button>{' '}
        <Button variant="success" onClick={() => setLg3Show(true)}>Submit Change Day Off Request</Button>{' '}
        <Button variant="info" onClick={() => setLg4Show(true)}>Submit Leave Request</Button>
        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
            Replacement Request Form
            </Modal.Title>
          </Modal.Header>
          <Modal.Body><ReplacementSlot /></Modal.Body>
        </Modal>

        <Modal
          size="lg"
          show={lgShow2}
          onHide={() => setLg2Show(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
            Replacement Request Form
            </Modal.Title>
          </Modal.Header>
          <Modal.Body><SlotLinkingtRequest /></Modal.Body>
        </Modal>

        <Modal
          size="lg"
          show={lgShow3}
          onHide={() => setLg3Show(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
            Change Day Off Request Form
            </Modal.Title>
          </Modal.Header>
          <Modal.Body><ChangeDayOfftRequest /></Modal.Body>
        </Modal>

        <Modal
          size="lg"
          show={lgShow4}
          onHide={() => setLg4Show(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
            Leave Request Form
            </Modal.Title>
          </Modal.Header>
          <Modal.Body><LeavesRequests /></Modal.Body>
        </Modal>
      </>
    );
  }
//component for updating and deleting slots
function RequestSent()
{
    const array = [{Sender: "Loaa Elzahar", RequestType: "Replacement"},
    {Sender: "Walid Elhefny", RequestType: "Change Day Off"},
    {Sender: "Loaa Elzahar", RequestType: "Slot Linking"},
    {Sender: "Walid Elhefny", RequestType: "Sick Leave"}];
    const tableRows= array.map(elem=>
    {
    return <RowComponentOfSentTable 
    Sender={elem.Sender}
    RequestType={elem.RequestType} 
    />
    })
    return (
    <div>
    <h5>Requests Sent To Other Academic Members</h5>
    <Table style={{textAlign:"center"}} striped bordered hover> 
    <thead>
    <tr>
    <th>Sender</th>
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
    return (
        <tr>
        <td>{props.Sender}</td>
        <td>{props.RequestType}</td>
        <td>Pending</td>
        <td><Button variant="primary">View Content</Button>{' '}</td>
        <td>
            <Button variant="danger">Cancel</Button>{' '}
        </td>
        </tr>
    );
}

//component for updating and deleting slots
function RequestReceived()
{
    const array = [{Sender: "Loaa Elzahar", RequestType: "Replacement"},
    {Sender: "Walid Elhefny", RequestType: "Change Day Off"},
    {Sender: "Loaa Elzahar", RequestType: "Slot Linking"},
    {Sender: "Walid Elhefny", RequestType: "Sick Leave"}];
    const tableRows= array.map(elem=>
    {
    return <RowComponentOfRecievedTable 
    Sender={elem.Sender}
    RequestType={elem.RequestType} 
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
    return (
        <tr>
        <td>{props.Sender}</td>
        <td>{props.RequestType}</td>
        <td>Pending</td>
        <td><Button variant="primary">View Content</Button>{' '}</td>
        <td>
            <Button variant="success">Accept</Button>{' '}
            <Button variant="danger">Reject</Button>{' '}
        </td>
        </tr>
    );
}

function RequestsPage()
{
    return(
    <div>
        <h1>Manage Requests Page</h1>
        <br></br>
        <ButtonSection />
        <br></br> <br></br>
        <RequestSent />
        <br></br>
        <RequestReceived />
    </div>
    )
}
export default RequestsPage;