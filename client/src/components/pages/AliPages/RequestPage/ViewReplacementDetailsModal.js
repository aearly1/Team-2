import React , {useState} from "react"

import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

function ViewReplacementDetails(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          View Details
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Request Details</Modal.Title>
          </Modal.Header>
          <Modal.Body><p>
            <b>Request sent by:</b> {props.Sender}
            </p>
            <p>
            <b>Request sent to:</b> {props.Reciever}
            </p>
            <p>
            <b>RequestType:</b> {props.RequestType}
            </p>
            <p>
            <b>Status:</b> {props.Status}
            </p>
            <p>
            <b>Replacement slot:</b>
            <br></br>
            StartTime: {props.ReplacementSlot.StartTime}
            <br></br>
            EndTime: {props.ReplacementSlot.EndTime}
            <br></br>
            Course Taught In Slot: {props.ReplacementSlot.CourseTaughtInSlot}
            <br></br>
            SlotLocation: {props.ReplacementSlot.SlotLocation}
            </p>
            </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

export default ViewReplacementDetails;