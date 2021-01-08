import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import RecievedRequests from "./RecievedRequestsComponent"
import SentRequests from "./RequestsSentComponent"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

function MainPage()
{
    return (
        <div>
        <h1>Manage Requests Page</h1>
        <Container fluid>
        <Row>
            <Col className="col-10">
                <RecievedRequests />  
                <br></br>   
                <SentRequests />       
            </Col>
            <Col>
            </Col>
        </Row>
        </Container>
        </div>
    )
}
export default MainPage;