import React , {useState} from "react"
import RowComponent from "./RowComponent"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown, Button, Table} from 'react-bootstrap'

function staffpercourse()
{
    const array = [{Type: "Instructor", email: "soubra@guc.com", name: "Hassan Soubra", office: "C7-219"},
    {Type: "Teaching Assistant", email: "loaa@guc.com", name: "Loaa", office: "C3-203"},
    {Type: "Teaching Assistant", email: "walid@guc.com", name: "Walid", office: "C3-203"}];
    var tableRows= array.map(elem=>
    {
    return <RowComponent 
    Type={elem.Type}
    email={elem.email} 
    name={elem.name}
    office={elem.office} />
    })
    const arr= useState(tableRows);
    
    return (<div>
        <h1>View Staff per Course</h1>
        <br></br>
        <Container>
        <Row>
            <Col> 
            <div>
            <Table style={{textAlign:"center"}} striped bordered hover> 
            <thead>
            <tr>
            <th>Type</th>
            <th>Email</th>
            <th>Name</th>
            <th>Office</th>
            </tr>
            </thead>
            <tbody>
            {arr}
            </tbody>
            </Table>
            </div>
            <br></br>
            </Col>
        </Row>
        </Container>
        
        </div>);
}

export default Slot;



/*import React from 'react'
import {Table,Container,Row,Col} from 'react-bootstrap'

function staffmembers()
{
    let style1 = {borderStyle:"solid", borderWidth: 3, backgroundColor: "#F7C344"}
    let style2 = {borderStyle:"solid", borderWidth: 3}

    const arr=[["Instructor", "soubra@guc.com", "Hassan Soubra", "C7-219"],
               ["Teaching Assistant", "loaa@guc.com","Loaa", "C3-203"],
               ["Teaching Assistant","walid@guc.com", "Walid", "C3-203"]];

    const tableRows = arr.map((elem)=>
    {
        return (<div><Row>
                <Col style={style1}><br></br>{elem[0]}<br></br><br></br></Col>
                </Row>
                <Row>
                <Col style={style1}><br></br>{elem[0]}<br></br><br></br></Col>
                </Row>
                <Row>
                <Col style={style1}><br></br>{elem[0]}<br></br><br></br></Col>
                </Row>
                </div>)
    })

    return (
    <div>
        <h1>Staff per departement</h1>
        <br></br>
        <Container style={{textAlign:"center"}}>
              <Row> <Col style={style1}><br></br> <br></br><br></br></Col> </Row>
            <Row>  <Col style={style1}><br></br>8:15-9:45<br></br><br></br></Col> </Row>
            <Row>  <Col style={style1}><br></br>8:15-9:45<br></br><br></br></Col> </Row>
            <Row>  <Col style={style1}><br></br>8:15-9:45<br></br><br></br></Col> </Row>
        {tableRows}
        </Container>
        <br></br>
    </div>
    );
}

export default staffmembers;*/