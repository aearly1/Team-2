import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import Notification from "./Notifications"
import RecievedRequests from "./RecievedRequestsComponent"
import SentRequests from "./RequestsSentComponent"
import ButtonSection from "./ButtonSection"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

function MainPage()
{
    return (
        <div>
        <h1>Manage Requests Page</h1>
        <br></br>
        <ButtonSection />
        <br></br>
        <br></br>
        <Container fluid>
        <Row>
            <Col className="col-10">
                <RecievedRequests />  
                <br></br>   
                <SentRequests />       
            </Col>
            <Col>
            <Notification />
            </Col>
        </Row>
        </Container>
        </div>
    )
}
export default MainPage;