import React, {useState, useEffect} from 'react';
import {Container, Form, Card, Dropdown, DropdownButton} from 'react-bootstrap';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useToken from '../general/useToken';
import axios from 'axios';
import Loading from 'react-loading';
const StaffCard = styled.div`
  .staffCard{
    width: 100%;
    box-shadow: 10px 5px;
  }
`;

function HODStaffDOS() {  
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
  const [options,setOptions]= useState([]);    
  const [mem,setMem]= useState({});
  const [rendered,setRendered]= useState(false);
  const [value1, setValue1] = useState('');
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(false);
  useEffect(()=>{
    async function doIt(){
    await axios.get('http://localhost:5000/api/hod/staff',{headers:{'auth-token':token}}).then((res)=>{
      let items = []
      res.data.map(staffMem =>{items.push({id:staffMem.userCode, name:staffMem.name})})
      setOptions(items);
      setLoading1(false);
    }
    ).catch(err=>console.log(err.response.data))}
    doIt();
    }, []  )

  const handleChange= async (e)=>{
    setLoading2(true);
    let thingy = JSON.parse(e)
    setValue1(thingy.name)
   await axios.post('http://localhost:5000/api/hod/staff-dos',{'staffId':thingy.id},{headers:{'auth-token':token}}).then((res)=>{ 
    setMem(res.data)  
    }).catch(err=>console.log(err.response.data))
    setLoading2(false)
    setRendered(true)
  }


  return (
      <Container fluid >
        <h1>  Select a staff member to view his day off:</h1>
        <div style = {{whiteSpace: 'nowrap', paddingLeft:0, marginLeft:0}}>
        <DropdownButton variant="warning" onSelect={handleChange} id="dropdown-basic-button" title={(value1==="")?"Select Member":value1}>
          {
            (!loading1)?(
            options.map(option => {
              let opt = JSON.stringify({id: option.id, name: option.name})
              return <Dropdown.Item eventKey={opt}>{option.name}</Dropdown.Item>
          }
          )):
          ( 
            <div align='center'>
            <Loading type={"bars"} color="#333" height={"20%"} width={'20%'} />
            </div>
          )}
        </DropdownButton>
        </div>
          {(!loading2)?(
            (rendered?(
          <StaffCard style ={{paddingTop:20 }} >
            {/*Need to hange info here to axios get request*/}
          <Card style={style1} >
            <Card.Body >
            <Card.Title style ={{fontSize: 30, textDecoration:"underline", textDecorationColor: "#B33F62"}}>{mem.staffMemberName}</Card.Title>
            <Card.Text>
            id: {mem.id}
            </Card.Text>
            <Card.Text>
            day-off: {mem.dayOff}
            </Card.Text>
            <Card.Text>
            type: {mem.subType}
            </Card.Text>
            </Card.Body>
          </Card>
          </StaffCard>
          ):(<div></div>))):
          ( 
            <div align='center'>
            <Loading type={"spinningBubbles"} color="#333" height={"10%"} width={'10%'} />
            </div>
          )
          }
      </Container>
    )
}
  HODStaffDOS.propTypes = {
    staff: PropTypes.object,
    staffMembers: PropTypes.string
  }
  
  HODStaffDOS.defaultProps = 
        {
       staff: { 
        id: "ac-2",
        staffMemberName: "Hassan Soubra",
        subType: "instructor",
        dayOff: "SAT"
      }
  };
  
export default HODStaffDOS
