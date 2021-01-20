import React, {useState, useEffect} from 'react';
import {Container, Card} from 'react-bootstrap';
import styled from 'styled-components'
import useToken from '../general/useToken';
import axios from 'axios';
import Loading from 'react-loading';

const StaffCard = styled.div`
  .staffCard{
    width: 100%;
    box-shadow: 10px 5px;
  }
`;


function HODStaffDO(props) {  


  const token = useToken().token
  
let style1 = {
  background:"linear-gradient(purple, transparent),linear-gradient(to top left, #2C2A8A, transparent),linear-gradient(to top right, #F9564F, transparent)",
  backgroundColor:"#0C0A4A" ,
  color: "white" ,
  borderRadius: 10, 
  boxShadow: "5px 10px 5px #9E9E9E",
  border:0,
  minWidth:750,
};


const [staff,setStaff]= useState([]);
const [loading,setLoading]= useState(true);
useEffect(()=>{
  async function doIt(){
  //GET THE Courses under department
  await axios.get('http://localhost:5000/api/hod/staff-do',{headers:{'auth-token':token}}).then((res)=>{
      let items = []
      res.data.map(staffMem => {items.push({ 
        id: staffMem.id,
        staffMemberName: staffMem.staffMemberName,
        subType: staffMem.subType,
        dayOff: staffMem.dayOff
      })})
      setLoading(false);
      setStaff(items);
  }).catch(err=>console.log(err.response.data))}
  doIt();
  }, []  )


return (
    <Container fluid >
    <h1>Staff Member Day Offs:</h1>
    
    {(!loading)?
    (        
      staff.map(staffMem => {
        return (
        <StaffCard style ={{paddingTop:20 }} >
          <Card style={style1} >
            <Card.Body >
            <Card.Title style ={{fontSize: 30, textDecoration:"underline", textDecorationColor: "#B33F62"}}>{staffMem.staffMemberName}</Card.Title>
            <Card.Text>
            id: {staffMem.id}
            </Card.Text>
            <Card.Text>
            day-off: {staffMem.dayOff}
            </Card.Text>
            <Card.Text>
            type: {staffMem.subType}
            </Card.Text>
            </Card.Body>
          </Card>
        </StaffCard>
        )
    })
    ):
    ( 
      <div align='center'>
      <Loading type={"spinningBubbles"} color="#333" height={'10%'} width={'10%'} />
      </div>
    )
    }

    
    </Container>
    )
}


export default HODStaffDO
