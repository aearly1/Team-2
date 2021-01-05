import React,{useState} from 'react';
import {Container, Button , Form, Col, Row} from 'react-bootstrap'
import axios from 'axios'
import Background from '../SohobPages/test.gif'
const Login = () => {
    const [email,setEmail] = useState("") 
    const [pass,setPass] = useState("") 
    const handleSubmit = e => {
        e.preventDefault()
        const user = {email: email,password: pass}
        axios.post("http://localhost:5000/api/login",user)
        .then(res => console.log(res.data))
        .catch(err => console.error(err))
        //setEmail("")
        //setPass("")
    }
    const handleEmail = (e) => {
        const emailn = e.target.value;
        setEmail(emailn);
    }
    const handlePass = (e) => {
        const passn = e.target.value;
        setPass(passn);
    }
    return (
        
        <Container style={{ backgroundImage: `url(${Background})`, padding:'100px' }} >
            <div style={{ outline: '20px', margin: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}  >
                <Form onSubmit={handleSubmit} style={{ width: '50%' }}>
                    <Form.Group controlId="formEmail">
                        <Row>
                            <Form.Label style={{ marginLeft: '10%', padding: '8px' }}>Email address</Form.Label>
                            <Col style={{ textAlign: 'center', alignItems: 'center' }}>

                                <Form.Control onChange={handleEmail} type="email" placeholder="Enter email" />
                            </Col>
                        </Row>
                    </Form.Group>
                    <br/>
                    <Form.Group controlId="formPassword">
                        <Row>
                            <Form.Label style={{ marginLeft: '0%', padding: '8px' }}>Password</Form.Label>
                            <Col style={{ textAlign: 'center', alignItems: 'center' }}>
                                <Form.Control onChange={handlePass} type="password" placeholder="Enter password" />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Row style={{ textAlign: 'right', alignItems: 'right', marginLeft: '155%' }}>
                        <Button variant="warning" type="submit">
                            Login
                        </Button>
                    </Row>
                </Form>
            </div>
        </Container>
        
        )
    }
    
    export default Login
    
    