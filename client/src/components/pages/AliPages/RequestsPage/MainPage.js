import React , {useState} from "react"
import ReplacementSlot from "./ReplacementRequests"
import SlotLinkingtRequest from "./SlotLinkingtRequests"
import ChangeDayOfftRequest from "./ChangeDayOffRequests"
import LeavesRequests from "./LeavesRequests"
import ButtonSection from "./ButtonSection"
import Notification from "./Notifications"
import RequestSent from "./RequestsSentComponent"
import RequestReceived from "./RequestsRecievedComponent"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

function RequestsPage()
{
    return(
    <div>
        <h1>Manage Requests Page</h1>
        <br></br>
        <ButtonSection />
        <br></br> <br></br>
        <Container fluid>
        <Row>
            <Col className="col-10">
                <RequestSent />
                <br></br>
                <RequestReceived />
            </Col>
            <Col>
                <Notification />
            </Col>
        </Row>
        </Container>
    </div>
    )
}
export default RequestsPage;