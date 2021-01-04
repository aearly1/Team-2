import React,{useState} from 'react';
import {Container, Button , Form} from 'react-bootstrap'
import axios from 'axios'
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
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onChange={handleEmail} type="email" placeholder="Enter email" />
                 </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={handlePass} placeholder="Password" />
                </Form.Group>
                <Button variant="warning" type="submit">
                    Login
                </Button>
            </Form>
        </Container>
    )
}

export default Login

