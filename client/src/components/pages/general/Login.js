import React,{useState} from 'react';
import {Container, Button , Form, Col, Row} from 'react-bootstrap'
import axios from 'axios'
import Background from '../SohobPages/test.gif'
import PropTypes from 'prop-types';

async function loginUser(credentials) {
    return fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

export default function Login ({setToken, setTokeypokey})  {
    const [email,setEmail] = useState("") 
    const [pass,setPass] = useState("") 

    

    const handleSubmit2 = e => {
        e.preventDefault()
        const user = {email: email,password: pass}
        axios.post("",user)
        .then(res => console.log(res.data))
        .catch(err => console.error(err))
        //setEmail("")
        //setPass("")
    }
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({email: email,password: pass});
        await setToken(token);
        await setTokeypokey(true);
      }
    return (
        
        <Container style={{ backgroundImage: `url(${Background})`, padding:'100px' }} >
            <div style={{ outline: '20px', margin: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}  >
                <Form onSubmit={handleSubmit} style={{ width: '50%' }}>
                    <Form.Group controlId="formEmail">
                        <Row>
                            <Form.Label style={{ marginLeft: '10%', padding: '8px' }}>Email address</Form.Label>
                            <Col style={{ textAlign: 'center', alignItems: 'center' }}>

                                <Form.Control onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                            </Col>
                        </Row>
                    </Form.Group>
                    <br/>
                    <Form.Group controlId="formPassword">
                        <Row>
                            <Form.Label style={{ marginLeft: '0%', padding: '8px' }}>Password</Form.Label>
                            <Col style={{ textAlign: 'center', alignItems: 'center' }}>
                                <Form.Control onChange={e => setPass(e.target.value)} type="password" placeholder="Enter password" />
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

    Login.propTypes = {
        setToken: PropTypes.func.isRequired
      }
    
    
    