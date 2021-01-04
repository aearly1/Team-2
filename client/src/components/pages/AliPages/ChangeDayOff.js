import React from "react"
import {Form, Table, Button,Container, Row, Col, DropdownButton,Dropdown} from 'react-bootstrap'

function FormApplication()
{
    return(
        <Form>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Desired Day Off</Form.Label>
            <Form.Control as="select" defaultValue="Choose...">
            <option>Choose...</option>
            <option>Sataurday</option>
            <option>Sunday</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            </Form.Control>
            </Form.Group>
        </Form.Row>
        <Form.Group controlId="formBasicReason">
            <Form.Label>Reason for change (optional)</Form.Label>
            <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
            Submit
        </Button>
        </Form>
    )
}
function Page()
{
    return(
        <div>
            <br></br>
            <FormApplication />
        </div>
    )
}

export default Page