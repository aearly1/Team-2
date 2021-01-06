import axios from 'axios'
import React,{useState,useEffect} from 'react'
import {Modal,Form,Button,Row,Col,Container,Alert} from 'react-bootstrap'
import useToken from '../general/useToken'
const Attendance = props => {
    const token = useToken().token
    const styles = {
            border: '5px groove rgba(0, 0, 0, 0.05)',
            borderRadius: '10px',
            padding: '50px',
            Button: 'rgba(0, 0, 0, 0.05)',
            background: 'rgb(242,225,202)'
        };
    const [selection,setSelection] = useState("All")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [attendance,setAttendance] = useState([])
       useEffect(() =>{
        axios.get('http://localhost:5000/api/staffs/attendance', {
        headers: {
          'auth-token': `${token}`
        }
      }).then((res) => {
        setAttendance(res.data);
        console.log(res.data)
      })
      .catch((error) => {
        console.error(error)
      })
       },[])

    const handleSignin = () => {
        axios.post('http://localhost:5000/api/staffs/signin',{},{
            headers: {
              'auth-token': `${token}`
            }
          }).then((res) => {
            setAttendance(res.data);
            console.log(res.data)
            setSuccess1(true)
          })
          .catch((error) => {
            console.error(error)
            console.log("dab")
            setAlert(true)
          })
    }

    const handleSignout = () => {
        axios.post('http://localhost:5000/api/staffs/signout',{},{
            headers: {
              'auth-token': `${token}`
            }
          }).then((res) => {
            setAttendance(res.data);
            console.log(res.data)
            setSuccess2(true)
          })
          .catch((error) => {
            console.error(error)
            console.log("dab")
            setAlert2(true)
          })
    }
    const [alert, setAlert] = useState(false);
    const [alert2, setAlert2] = useState(false);
    const [success1,setSuccess1]= useState(false);
    const [success2,setSuccess2]= useState(false);
    const alertfunc = () => {
        
      
        if (alert) {
          return (
            <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>
                Working hours have passed!
              </p>
            </Alert>
          );
        }
        if(alert2){
            return (
              <Alert variant="danger" onClose={() => setAlert2(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Cannot sign out before signing in!
                </p>
              </Alert>
            );
          }
        if(success1){
            return (
                <Alert variant="success" onClose={() => setSuccess1(false)} dismissible>
                  <Alert.Heading>Yay!</Alert.Heading>
                  <p>
                    Signed in!
                  </p>
                </Alert>
              );
        }
        if(success2){
            return (
                <Alert variant="success" onClose={() => setSuccess2(false)} dismissible>
                  <Alert.Heading>Yay!</Alert.Heading>
                  <p>
                    Signed out!
                  </p>
                </Alert>
              );
        }

      }

    return(
        <div>
            <Container style={styles} fluid="">
            {alertfunc()}
            <Row md={2}>
                <Col xs={2} >
                    <Row md={8} >

                    </Row><div style={{ outline: '20px', margin: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}  >
                    <Row style={{ margin: '25px' }}>
                        <Col><i class="far fa-user-circle"></i>
                        <Button onClick={handleSignin} >Sign in</Button></Col><Col><Button variant="secondary" onClick={handleSignout}>Sign out</Button></Col>
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
                <Form.Control as="select" onChange={e => setSelection(e.target.value)}>
                    <option>All</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </Form.Control>
            </Form.Group>
            <ul>
                {attendance.map(a =><li>{(Date.parse(a.time)).toString()}</li>)}
            </ul>
            </Modal.Body>
            <Modal.Footer><Button> View </Button></Modal.Footer>
        </Modal>
        </div>
    )
}

export default Attendance;