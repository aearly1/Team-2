import React, {useState, useEffect} from 'react';
import {Container,Card, Dropdown, DropdownButton} from 'react-bootstrap';
import styled from 'styled-components';
import useToken from '../general/useToken';
import axios from 'axios';
import Loading from 'react-loading';
const StaffCard = styled.div`
  .staffCard{
    width: auto;
    box-shadow: 10px 5px;
  }
`;


function HODCourseStaff() {   
  let style1 = {
    background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
    backgroundColor:"#0C0A4A" ,
    color: "white" ,
    borderRadius: 10, 
    boxShadow: "5px 10px 5px #9E9E9E",
    border:0,
    minWidth:750,
};
  const token = useToken().token
  const [value1,setValue1]= useState('');
  const [options1,setOptions1]= useState([]);
  const [members,setMembers]= useState([]);
  const [rendered,setRendered]= useState(false);
  const [loading1,setLoading1]= useState(true);
  const [loading2,setLoading2]= useState(false);

  useEffect(()=>{
    async function doIt(){
    //GET THE Courses under department
    await axios.get('http://localhost:5000/api/hod/courses',{headers:{'auth-token':token}}).then((res)=>{
        let items = []
        res.data.map(course => {items.push({ courseName:course.courseName})})
        setLoading1(false)
        setOptions1(items);
    }).catch(err=>console.log(err.response.data))}
    doIt();
    }, []  )

  const handleChange= async (e)=>{
    setLoading2(true)
    setValue1(e)
    await axios.post('http://localhost:5000/api/hod/staff-crs',{'courseName':e},{headers:{'auth-token':token}}).then((res)=>{ 
    setLoading2(false)
    setMembers(res.data)
    }).catch(err=>console.log(err.response.data))

    setRendered(true)
  }

  return (
      <Container fluid >
      <h1>Select a course to view its staff members:</h1>
      <div style = {{whiteSpace: 'nowrap', paddingLeft:10, marginLeft:0}}>
      <DropdownButton variant="warning" onSelect={handleChange} id="dropdown-basic-button" title={(value1==="")?"Select Member":value1}>
          {(!loading1)?(
            options1.map(opt => {
              return <Dropdown.Item eventKey={opt.courseName}>{opt.courseName}</Dropdown.Item>
          }
          )):
          ( 
            <div align='center'>
            <Loading type={"bars"} color="#333" height={'10%'} width={'10%'} />
            </div>
          )
          }
        </DropdownButton>
      </div>
      {(!loading2)?(
        rendered?(
        members.map(staffMem => {
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
        )
      ):(
        <div></div>
      )):
          ( 
            <div align='center' style={{marginTop:100}}>
              <Loading type={"spinningBubbles"} color="#333" height={'10%'} width={'10%'} />
            </div>
          )
      
      }
      </Container>
  )
} 

  
export default HODCourseStaff
