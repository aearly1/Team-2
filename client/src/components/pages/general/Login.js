import React from 'react';
import {Container, Button , Form} from 'react-bootstrap'

const Login = () => {
    return (
        <Container fluid>
            <Form>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                 </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="warning" type="submit">
                    Login
                </Button>
            </Form>
        </Container>
    )
}

export default Login

