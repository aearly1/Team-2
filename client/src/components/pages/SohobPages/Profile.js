import React, { useState } from 'react'
import { Container, Row, Col, Button, Modal, Image, Form, InputGroup } from 'react-bootstrap'
import useToken from '../general/useToken'
import styled from 'styled-components'
const StaffCard = styled.div`
.staffCard{
  width: 100%;
  box-shadow: 10px 5px;
}
`;  
const Profile = props => {
    const token = useToken().token

    const styles = {
        border: '5px groove rgba(0, 0, 0, 0.05)',
        borderRadius: '10px',
        padding: '50px',
        Button: 'rgba(0, 0, 0, 0.05)',
        background: 'rgb(242,225,202)'
    };
    
   

let style1 = {
    background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
    backgroundColor:"#0C0A4A" ,
    color: "white" ,
    borderRadius: 10, 
    boxShadow: "5px 10px 5px #9E9E9E",
    minWidth:750,
  };
  
    return (<div >
        <StaffCard>
        <Container style={style1} fluid="">
            <Row md={1}><div style={{ width: 450, height: 'auto', textAlign: 'center' }}>
                <Image roundedCircle width="auto" height="180px" src="https://i2-prod.walesonline.co.uk/incoming/article18912156.ece/ALTERNATES/s1200c/0_Borat.jpg"
                /></div></Row>
            <Row md={2}>
                <Col xs={2} >
                    <Row md={8} >

                    </Row><div style={{ outline: '20px', margin: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}  >
                        <Row style={{ margin: '25px' }}>
                            Name: 7amada sha3r 
                        </Row>
                        <Row style={{ margin: '25px' }}>
                            Email: sexysoso@hotmail.com
                        </Row>
                        <Row style={{ margin: '25px' }}>
                            ID: 43-8530
                        </Row>
                        <Row style={{ margin: '25px' }}>
                            Day Off: SAT
                        </Row>
                        <Row style={{ margin: '25px' }}>
                            Annual Leaves: 69
                        </Row></div>
                </Col>

                <Col><div style={{ outline: '20px', margin: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}  >
                    <Row style={{ margin: '25px' }}>
                        Office: C4.404
                    </Row>
                    <Row style={{ margin: '25px' }}>
                        Faculty: Tegara
                    </Row>
                    <Row style={{ margin: '25px' }}>
                        Department: Fawanees
                    </Row>
                    <Row style={{ margin: '25px' }}>
                        Salary: 10 bolbol
                    </Row>
                    <Row style={{ margin: '25px' }}>
                        <Button variant ="warning">View Courses</Button>
                    </Row></div>
                </Col>
            </Row>
        </Container>
        </StaffCard>
    </div>
    )
}

export default Profile