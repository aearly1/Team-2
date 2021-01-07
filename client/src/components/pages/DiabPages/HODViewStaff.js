import React, {useState, useEffect} from 'react';
import {Container,Card } from 'react-bootstrap';
import styled from 'styled-components';
import useToken from '../general/useToken';
import axios from 'axios'
import Loading from 'react-loading'

const StaffCard = styled.div`
  .staffCard{
    width: 100%;
    box-shadow: 10px 5px;
  }
`;

const custDropDown = styled.div`
  .dropdown-link a{
    background: red; color: yellow; !important;
  }
`
//<DropdownButton  variant="primary" onSelect={handleSelect} className="dropdown-link" title={(value1==="")?"Select Course":value1} style={style2}>
       
function HODViewStaff() {
    let style1 = {
        background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
        backgroundColor:"#0C0A4A" ,
        color: "white" ,
        borderRadius: 10, 
        boxShadow: "5px 10px 5px #9E9E9E",
        border:0,
        minWidth:750,
    };
    
    const [staffList,setStaffList]= useState([]);
    const [loading,setLoading]= useState(true);
    
    const token = useToken().token
    useEffect(()=>{
    axios.get('http://localhost:5000/api/hod/staff',{headers:{'auth-token':token}}).then((res)=>{
        setStaffList(res.data)
        setLoading(false)
    }).catch(err=>console.log(err.response.data))
    }, []  )

   
    return (
        
        <Container fluid >
        
        {/*
          (props.course==='')?(
          //if this is not coming from /course-staff then it's just a view all staff
          <h1 style = {{whiteSpace: 'nowrap'}}>Staff members in your department: </h1>
        ):(
          //but if the course is not empty, then it came from a /course-staff
          <h1 style = {{whiteSpace: 'nowrap'}}>Staff members assigned to {props.course}:</h1>
        )*/
        }
        
        {(!loading)?(
          staffList.map(staffMem => {
            return (
            <StaffCard style ={{paddingTop:20 }} >
                <Card style={style1} >
                <table style={{width: "100%"}}>
                <colgroup>
                    <col span="1" style={{width: "10%"}}/>
                    <col span="1" style={{width: "90%"}}/>
                </colgroup>
                <tbody>
                    <tr>
                    <td >
                    {staffMem.imgLink?
                      ( 
                        <img style={{borderRadius:10}} width="250" height="250" src={staffMem.imgLink} />
                      ):
                      (
                        <img style={{borderRadius:10}} width="250" height="250" src='https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg' /> // This is the default icon
                      )
                    }
                    </td>
                    <td >
                    <Card.Body >
                        <Card.Title style ={{fontSize: 30, textDecoration:"underline", textDecorationColor: "#B33F62"}}>{staffMem.name}</Card.Title>
                        <Card.Text>
                        Type: {staffMem.subType}
                        </Card.Text>
                        <Card.Text>
                        id: {staffMem.userCode}
                        </Card.Text>
                        <Card.Text>
                        Email: {staffMem.email}
                        </Card.Text>
                        </Card.Body>
                    </td>
                    </tr>
                    </tbody>
                </table>
                
                </Card>
            </StaffCard>
            )
        }
        )):
        ( 
          <div align='center'>
          <Loading type={"spinningBubbles"} color="#333" height={'10%'} width={'10%'} />
          </div>
        )}
        </Container>
    )
}

  
export default HODViewStaff
