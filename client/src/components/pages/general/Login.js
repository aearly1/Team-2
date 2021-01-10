import React,{useState} from 'react';
import {Container, Button , Form, Col, Row} from 'react-bootstrap'
import axios from 'axios'
import Background from '../SohobPages/guc_cairo_campus2.jpg'
import PropTypes from 'prop-types';
import styles from '../SohobPages/Sohob'
import {Redirect,useHistory} from 'react-router-dom'
import { Textbox } from 'react-inputs-validation';
async function loginUser(credentials) {
    return fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
      .catch(err=> alert("The email/password combination you entered was incorrect"))
   }

export default function Login ({setToken, setTokeypokey})  {
    const [email,setEmail] = useState("") 
    const [pass,setPass] = useState("") 
    const history = useHistory()
    const handleSubmit = async e => {
        e.preventDefault();
        try{
        const token = await loginUser({email: email,password: pass});
        await setToken(token);
        await setTokeypokey(true);
        history.push("/profile");
        }
        catch (er) {
           // alert(er.message);
          }
      }
    return (

/*<div  style={{padding:'100px',marginTop:"0px",background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
backgroundColor:"#0C0A4A" ,height:'800px'}}>
<Container style={{backgroundImage: `url(${Background})`,backgroundSize: 'cover',overflow:'hidden',backgroundPosition:'center', padding:'100px' ,backgroundRepeat:'false'}} >
    <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
      
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
</Container>
</div>*/
       <div  style={{padding:'100px',marginTop:"0px",background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
        backgroundColor:"#0C0A4A" ,height:'100%'}}>
       <Container  style={{backgroundImage: `url(${Background})`,backgroundSize: 'cover',overflow:'hidden',backgroundPosition:'center', padding:'100px' ,backgroundRepeat:'false'}} >
            <div style={{padding:"10px", outline: '20px', margin: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}  >
                <br/>
                <Form onSubmit={handleSubmit} >
                    <Form.Group as={Row} controlId="formEmail">
                        
                            <Form.Label column sm="2" style={{color:'white'}}>
                                Email address
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                            </Col>
                    </Form.Group>
                    <br/>
                    <Form.Group as={Row}  controlId="formPassword">
                            <Form.Label column sm="2" style={{color:'white'}}>
                                Password
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={e => setPass(e.target.value)} type="password" placeholder="Enter password" />
                            </Col>
                    </Form.Group>
                        <Button variant="warning" type="submit">
                            Login
                        </Button>
                </Form>
            </div>
        </Container>
        </div>
        )
    }

    <Form>
  <Form.Group as={Row} controlId="formPlaintextEmail">
    <Form.Label column sm="2">
      Email
    </Form.Label>
    <Col sm="10">
      <Form.Control plaintext readOnly defaultValue="email@example.com" />
    </Col>
  </Form.Group>

  <Form.Group as={Row} controlId="formPlaintextPassword">
    <Form.Label column sm="2">
      Password
    </Form.Label>
    <Col sm="10">
      <Form.Control type="password" placeholder="Password" />
    </Col>
  </Form.Group>
</Form>
    Login.propTypes = {
        setToken: PropTypes.func.isRequired
      }
    
    
    