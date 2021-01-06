import React, {useState, useEffect} from 'react';
import {Container, Form, Card, Dropdown, DropdownButton} from 'react-bootstrap';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useToken from '../general/useToken';
import axios from 'axios'

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
    minWidth:750,
  };
  const [options,setOptions]= useState([]);    
  const [mem,setMem]= useState({});
  const [rendered,setRendered]= useState(false);
  const [value1, setValue1] = useState('');
  useEffect(()=>{
    async function doIt(){
    await axios.get('http://localhost:5000/api/hod/staff',{headers:{'auth-token':token}}).then((res)=>{
        let items = []
        res.data.map(staffMem =>{items.push({id:staffMem.userCode, name:staffMem.name})})
        setOptions(items);
    }
    ).catch(err=>alert(err))}
    doIt();
    }, []  )

  const handleChange= async (e)=>{
    let thingy = JSON.parse(e)
    setValue1(thingy.name)
   await axios.post('http://localhost:5000/api/hod/staff-dos',{'staffId':thingy.id},{headers:{'auth-token':token}}).then((res)=>{ 
    setMem(res.data)  
    }).catch(err=>alert(err))

    setRendered(true)
  }


  return (
      <Container fluid >
        <h1>  Select a staff member to view his day off:</h1>
        <div style = {{whiteSpace: 'nowrap', paddingLeft:0, marginLeft:0}}>
        <DropdownButton variant="warning" onSelect={handleChange} id="dropdown-basic-button" title={(value1==="")?"Select Member":value1}>
          {options.map(option => {
              let opt = JSON.stringify({id: option.id, name: option.name})
              return <Dropdown.Item eventKey={opt}>{option.name}</Dropdown.Item>
          }
          )}
        </DropdownButton>
        </div>
          {(rendered?(
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
          ):(<div></div>))}
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
