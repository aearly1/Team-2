import axios from 'axios'
import React, { useState,useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Image, Form, InputGroup } from 'react-bootstrap'
import useToken from '../general/useToken'
import styled from 'styled-components'
import { usePromiseTracker,trackPromise } from "react-promise-tracker";
import ReactLoading from 'react-loading';
import { useHistory } from 'react-router-dom';

const StaffCard = styled.div`
.staffCard{
  width: 100%;
  box-shadow: 10px 5px;
}
`;  
const Profile = props => {
    let history = useHistory()
    const Load = ({ type, color }) => (
        <ReactLoading type={type} color={color} height={667} width={375} />
    );
    const LoadingIndicator = props => {
        const { promiseInProgress } = usePromiseTracker();
          return (
            promiseInProgress && 
            <div style={{padding:'100px',marginLeft:'30%'}}>
            <Load type='balls' color='#0C0A4A' /></div>
         );  
         }
    const token = useToken().token
    const styles = {
        border: '5px groove rgba(0, 0, 0, 0.05)',
        borderRadius: '10px',
        padding: '50px',
        Button: 'rgba(0, 0, 0, 0.05)',
        background: 'rgb(242,225,202)'
    };
    
   

let style1 = {
    background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
    backgroundColor:"#0C0A4A" ,
    color: "white" ,
    borderRadius: 10, 
    boxShadow: "5px 10px 5px #9E9E9E",
    minWidth:750,
  };
  
    
   const [user,setUser] = useState({})
   const [courses,setCourses] = useState([])
   const [show, setShow] = useState(false);
   const [edit, setEdit] = useState(false);
   const [updatedEmail, setEmail] = useState()
   const [updatedOffice, setOffice] = useState()
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
       useEffect(() =>{
        trackPromise(axios.get('http://localhost:5000/api/staffs/profile', {
        headers: {
          'auth-token': `${token}`
        }
      }).then((res) => {
        setUser(res.data)
        setCourses(res.data.Courses);
        console.log(res.data)
      })
      .catch((error) => {
        console.error(error)
      }))
       },[])
    const handleEdit = () => setEdit(true);
    const handleEditc = () => setEdit(false);
    const handleSubmit = () =>{
        axios.put('http://localhost:5000/api/staffs/profile/update',{email: updatedEmail,office: updatedOffice},{
            headers: {
              'auth-token': `${token}`
            }
          }).then((res) => {
            console.log(res.data)
            //setSuccess(true)
            history.push('/logout')
            handleEdit()
          })
          .catch((error) => {
            console.error(error)
            console.log("dab")
            //setAlert(true)
            handleEdit()
          })
    }
    return (
            <div >
                <LoadingIndicator/>
            <StaffCard>
        <Container style={style1} fluid="">
            <Row md={1}><div style={{ width: 450, height: 'auto', textAlign: 'center' }}>
                <Image roundedCircle width="auto" height="180px" src="https://i2-prod.walesonline.co.uk/incoming/article18912156.ece/ALTERNATES/s1200c/0_Borat.jpg"
                /></div></Row>
            <Row md={2}>
                <Col xs={2} >
                    <Row md={8} >

                    </Row><div style={{ outline: '20px', margin: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}  >
                        <Row style={{ margin: '25px' }}>
                            Name: {user.Name}
                        </Row>
                        {!edit?<Row style={{ margin: '25px' }}>
                            Email: {user.Email}
                        </Row>:<div>
                        <Row style={{ margin: '25px' }}>
                        Email: <input onChange={e=>setEmail(e.target.value)} placeholder="Enter new Email"></input>
                        </Row></div>}
                        <Row style={{ margin: '25px' }}>
                            ID: {user.ID}
                        </Row>
                        <Row style={{ margin: '25px' }}>
                            Day Off: {user.DayOff}
                        </Row>
                        <Row style={{ margin: '25px' }}>
                            Annual Leaves: {user.annualLeaves}
                        </Row></div>
                </Col>

                <Col><div style={{ outline: '20px', margin: '0px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}  >
                {!edit?<Row style={{ margin: '25px' }}>
                            Office: {user.Office}
                        </Row>:<div>
                        <Row style={{ margin: '25px' }}>
                        Office: <input placeholder="Enter new Office" onChange={e=>setOffice(e.target.value)}></input>
                        </Row></div>}
                    <Row style={{ margin: '25px' }}>
                        Faculty: {user.FacultyName}
                    </Row>
                    <Row style={{ margin: '25px' }}>
                        Department: {user.DepartmentName}
                    </Row>
                    <Row style={{ margin: '25px' }}>
                        Salary: {user.Salary}
                    </Row>
                    <Row style={{ margin: '25px' }}>
                        <Button onClick={handleShow}>View Courses</Button>
                    </Row></div>
                </Col>
                {!edit?<Button show='false' onClick ={handleEdit}>Edit</Button>:
                <div><Button onClick={handleSubmit}>Save</Button><Button onClick ={handleEditc}>Cancel</Button></div>}
            </Row>
        </Container>
        </StaffCard>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Courses</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ margin: '25px' }}> 
                <ul>
            {courses.map(c => <li>{c}</li>)}
                </ul>
                </Modal.Body>
        </Modal>
        
    </div>
    )
}

export default Profile