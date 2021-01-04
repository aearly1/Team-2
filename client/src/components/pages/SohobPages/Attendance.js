import React,{useState} from 'react'
import {Modal,Form,Button,Row,Col,Container} from 'react-bootstrap'
const Attendance = props => {
        const styles = {
            border: '5px groove rgba(0, 0, 0, 0.05)',
            borderRadius: '10px',
            padding: '50px',
            Button: 'rgba(0, 0, 0, 0.05)',
            background: 'rgb(242,225,202)'
        };
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return(
        <div>
            <Container style={styles} fluid="">
            
            <Row md={2}>
                <Col xs={2} >
                    <Row md={8} >

                    </Row><div style={{ outline: '20px', margin: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}  >
                    <Row style={{ margin: '25px' }}>
                        <Col><i class="far fa-user-circle"></i>
                        <Button >Sign in</Button></Col>{' '}<Col><Button variant="secondary">Sign out</Button></Col>
                        </Row>
                        <Row style={{ margin: '25px' }}>
                        <Button onClick={handleShow}>View Attendance</Button>
                        </Row>
                        </div>
                </Col>

                <Col><div style={{ outline: '20px', margin: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}  >
                    </div>
                </Col>
            </Row>
        </Container>
        
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Attendance</Modal.Title>
            </Modal.Header>
            <Modal.Body> <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Specify Month:</Form.Label>
                <Form.Control as="select">
                    <option>All</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </Form.Control>
            </Form.Group></Modal.Body>
            <Modal.Footer><Button> View </Button></Modal.Footer>
        </Modal>
        </div>
    )
}

export default Attendance;