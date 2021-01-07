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


function HODTeachAssignments() {   
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
  const [loading1,setLoading1]= useState(true);
  const [loading2,setLoading2]= useState(false);
  const [options1,setOptions1]= useState([]);
  const [slots,setSlots]= useState([]);
  const [rendered,setRendered]= useState(false);

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
    setLoading2(true);
    setValue1(e)
    await axios.post('http://localhost:5000/api/hod/teaching-assignments',{'courseName':e},{headers:{'auth-token':token}}).then((res)=>{ 
    setSlots(res.data)  
    setLoading2(false)
    setRendered(true)
    }).catch(err=>console.log(err.response.data))
  }

  return (
      <Container fluid >
      <h1>  Select a course to view its slot assignments:</h1>
      <div style = {{whiteSpace: 'nowrap', paddingLeft:10, marginLeft:0}}>
      <DropdownButton variant="warning" onSelect={handleChange} id="dropdown-basic-button" title={(value1==="")?"Select Course":value1}>
          { (!loading1)?(
            options1.map(opt => {
              return <Dropdown.Item eventKey={opt.courseName}>{opt.courseName}</Dropdown.Item>
          }
          )):
          ( 
            <div align='center'>
            <Loading type={"bars"} color="#333" height={'20%'} width={'20%'} />
            </div>
          )
          }
        </DropdownButton>
      </div>
      {(!loading2)?(
        rendered?(
        slots.map(slot => {
          return (
            
          <StaffCard style ={{paddingTop:20 }} >
            <Card style={style1} >
            
            <table style={{width: "100%"}}>
                <colgroup>
                    <col span="1" style={{width: "50%"}}/>
                    <col span="1" style={{width: "50%"}}/>
                </colgroup>
                <tbody>
                    <tr>
                    <td >
                    <Card.Body >
                    <Card.Title style ={{fontSize: 30, textDecoration:"underline", textDecorationColor: "#B33F62"}}>Slot</Card.Title>
                    <Card.Text>
                    Start time: {slot.startTime}
                    </Card.Text>
                    <Card.Text>
                    End time: {slot.endTime}
                    </Card.Text>
                    <Card.Text>
                    Location: {slot.location}
                    </Card.Text>
                    <Card.Text>
                    Slot Assignment: {slot.isAssigned?(
                      <><strong>is assigned!</strong> </>):(<> <strong> not assigned!</strong> </>)}
                    </Card.Text>
                    </Card.Body>
                    </td>
                    <td >
                    {(slot.isAssigned)?(
                    <Card.Body style={{marginTop:"40px"}}>
                    <Card.Title style ={{fontSize: 20}}>Assigned to: </Card.Title>
                    <Card.Text>
                    Staff name: {slot.staffTeachingSlotName}
                    </Card.Text>
                    <Card.Text >
                    Staff id: {slot.staffTeachingSlotId}
                    </Card.Text>
                    <Card.Text>
                    Staff type: {slot.staffTeachingSlotSubType}
                    </Card.Text>
                    </Card.Body>
                    )
                    :
                    (
                      <div></div>
                    )
                    }
                    
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
          <div align='center' style={{paddingTop:100}}>
          <Loading type={"spinningBubbles"} color="#333" height={'10%'} width={'10%'} />
          </div>
        )}
      </Container>
  )
} 

  
export default HODTeachAssignments
