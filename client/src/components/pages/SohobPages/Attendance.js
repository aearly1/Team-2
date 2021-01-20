import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col, Container, Alert,Card,CardDeck } from 'react-bootstrap'
import useToken from '../general/useToken'
import ReactLoading from 'react-loading'
import { usePromiseTracker,trackPromise } from "react-promise-tracker";
const Attendance = props => {
  const token = useToken().token
  const styles = {border:0,
    borderRadius: '10px',
    padding: '50px',
    Button: 'rgba(0, 0, 0, 0.05)',
    background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
    border:0,
    backgroundColor:"#0C0A4A" ,
  };
  const [selection, setSelection] = useState("All")
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [attendance, setAttendance] = useState([])
  const [missingdays, setMissingDays] = useState([])
  const [missinghours, setMissingHours] = useState()
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [alert, setAlert] = useState(false);
  const [alert2, setAlert2] = useState(false);
  const [success1, setSuccess1] = useState(false);
  const [success2, setSuccess2] = useState(false);

  const Load = ({ type, color }) => (
    <ReactLoading type={type} color={color} height={667} width={375} />
);
const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
      return (
        promiseInProgress && 
        <div style={{background: '5px groove rgba(0, 0, 0, 0.5)',position:'fixed'}}>
        <Load type='balls' color='#0C0A4A' /></div>
     );  
     }

  useEffect(() => {
    if (selection == "All") {
      trackPromise(axios.get('http://localhost:5000/api/staffs/attendance', {
        headers: {
          'auth-token': `${token}`
        }
      }).then((res) => {
        setAttendance(res.data);
        console.log(res.data)
      })
        .catch((error) => {
          console.error(error)
        }))
    }
    else {
      trackPromise(axios.get('http://localhost:5000/api/staffs/attendance' + '/' + selection, {
        headers: {
          'auth-token': `${token}`
        }
      }).then((res) => {
        setAttendance(res.data);
        console.log(res.data)
      })
        .catch((error) => {
          console.error(error)
        }))
    }
  }, [selection])

  useEffect(() => {

    trackPromise(axios.get('http://localhost:5000/api/staffs/missingdays', {
      headers: {
        'auth-token': `${token}`
      }
    }).then((res) => {
      setMissingDays(res.data);
      console.log(res.data)
    })
      .catch((error) => {
        console.error(error)
      }))

  }, [attendance])

  useEffect(() => {

    trackPromise(axios.get('http://localhost:5000/api/staffs/missinghours', {
      headers: {
        'auth-token': `${token}`
      }
    }).then((res) => {
      setMissingHours(res.data);
      console.log(res.data)
    })
      .catch((error) => {
        console.error(error)
      }))

  }, [])


  const handleSignin = () => {
    trackPromise(axios.post('http://localhost:5000/api/staffs/signin', {}, {
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
      }))
  }

  const handleSignout = () => {
    trackPromise(axios.post('http://localhost:5000/api/staffs/signout', {}, {
      headers: {
        'auth-token': `${token}`
      }
    }).then((res) => {
      setAttendance(res.data);
      console.log(res.data)
      setSuccess2(true)
    })
      .catch((error) => {
        console.error(error.response.data)
        console.log("dab")
        setAlert2(true)
      }))
  }
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
    if (alert2) {
      return (
        <Alert variant="danger" onClose={() => setAlert2(false)} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            Cannot sign out before signing in!
                </p>
        </Alert>
      );
    }
    if (success1) {
      return (
        <Alert variant="success" onClose={() => setSuccess1(false)} dismissible>
          <Alert.Heading>Yay!</Alert.Heading>
          <p>
            Signed in!
                  </p>
        </Alert>
      );
    }
    if (success2) {
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

  const mapping = (d) => {
    let x = new Date(d.time)
    return (<div><li style={{ margin: '25px' }}>{x.toLocaleString() + ", " + d.op}</li></div>)
  }

  return (
    <div>
      
      <Container style={styles} fluid="">
        {alertfunc()}
        <CardDeck>
  <Card>
    <Card.Body>
      <Card.Title>Sign in/out</Card.Title>
      <Card.Text>
        This is to either sign in or sign out
      </Card.Text>
    </Card.Body>
    <Card.Footer>
    <Button  variant="warning" onClick={handleSignin} >Sign in</Button>
    <Button variant="secondary" onClick={handleSignout}>Sign out</Button>
    </Card.Footer>
  </Card>
  <Card>
    <Card.Body>
      <Card.Title>View attendance</Card.Title>
      <Card.Text>
        This is to view your attendance.{' '}
      </Card.Text>
    </Card.Body>
    <Card.Footer>
    <Button variant="warning" onClick={handleShow}>View Attendance</Button>
    </Card.Footer>
  </Card>
</CardDeck>
<br/>
<CardDeck>
  <Card>
    <Card.Body>
      <Card.Title>View Missing Days</Card.Title>
      <Card.Text>
        This is to view the days you missed. Ya fashel yabo mol7a2.
      </Card.Text>
    </Card.Body>
    <Card.Footer>
    <Button variant="warning" onClick={handleShow1}>View Missing Days</Button>
    </Card.Footer>
  </Card>
  <Card>
    <Card.Body>
      <Card.Title>View Missing Hours</Card.Title>
      <Card.Text>
        This is to view the hours you missed across the month.{' '}
      </Card.Text>
    </Card.Body>
    <Card.Footer>
    <Button variant="warning" onClick={handleShow2}>View Missing Hours</Button>
    </Card.Footer>
  </Card>
</CardDeck>
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
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </Form.Control>
        </Form.Group>
        <LoadingIndicator/>
          <ul>
            {attendance.map(mapping)}
          </ul>
        </Modal.Body>
      </Modal>

      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Missing Days</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoadingIndicator/>
          <ul>
            {missingdays.map(d => <li style={{ margin: '25px' }}>{d.Day + "/" + d.Month}</li>)}
          </ul>
        </Modal.Body>
      </Modal>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Missing Hours</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <LoadingIndicator/>
          {missinghours ? <div>{missinghours.Hours + ":" + missinghours.Mins}</div> : null}
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default Attendance;