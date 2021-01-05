import React from "react"
import {Form, Table, Button,Container, Row, Col, DropdownButton,Dropdown} from 'react-bootstrap'

 function Page()
 {
    return (
        <Form>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Leave Type</Form.Label>
            <Form.Control as="select" defaultValue="Choose...">
            <option>Choose...</option>
            <option>Annual Leaves</option>
            <option>Accidental Leaves</option>
            <option>Sick Leaves</option>
            <option>Maternity Leaves</option>
            <option>Compensation Leaves</option>
            </Form.Control>
            </Form.Group>
        </Form.Row>

        <Form.Group controlId="formGridAddress1">
            <Form.Label>Reason for leave</Form.Label>
            <Form.Control as="textarea" rows={3} />
        </Form.Group>

        <Form.Group controlId="formGridAddress2">
            <Form.Label>Google Drive Link to Uploaded Documents (in case of sick and maternity leaves)</Form.Label>
            <Form.Control placeholder="" />
        </Form.Group>
        <Form.Group controlId="formGridAddress2">
            <Form.Label>Replacement Staff Name (in case of replacement staff and if applicable</Form.Label>
            <Form.Control placeholder="" />
        </Form.Group>

        <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>Start Date of Leave</Form.Label>
            <Form.Control as="select" defaultValue="Choose...">
            <option>Choose...</option>
            <option>Annual Leaves</option>
            <option>Accidental Leaves</option>
            <option>Sick Leaves</option>
            <option>Maternity Leaves</option>
            <option>Compensation Leaves</option>
            </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
            <Form.Label>End Date of Leave</Form.Label>
            <Form.Control as="select" defaultValue="Choose...">
            <option>Choose...</option>
            <option>Annual Leaves</option>
            <option>Accidental Leaves</option>
            <option>Sick Leaves</option>
            <option>Maternity Leaves</option>
            <option>Compensation Leaves</option>
            </Form.Control>
            </Form.Group>
        </Form.Row>

        <Button variant="primary" type="submit">
            Submit
        </Button>
        </Form>
    )
 }
export default Page