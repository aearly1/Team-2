import React , {useState} from "react"
import ReplacementSlot from "./ReplacementRequests"
import SlotLinkingtRequest from "./SlotLinkingtRequests"
import ChangeDayOfftRequest from "./ChangeDayOffRequests"
import LeavesRequests from "./LeavesRequests"
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
          onHide={() => {setLg2Show(false);window.location.reload(true);}}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
            Slot Linking Request Form
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

  export default ButtonSection;