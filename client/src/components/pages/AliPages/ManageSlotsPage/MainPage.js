import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import TableScrollbar from 'react-table-scrollbar';
import RowComponent from './RowComponent'
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown, Button, Table} from 'react-bootstrap'
import { assertNullLiteralTypeAnnotation } from '@babel/types'

//slot page component
function Slot()
{
    const token = useToken().token
    var[options2, setOptions2]= useState([]);
    var[options2, setOptions2]= useState([]);
    var [arr,setArr]= useState([]);

    useEffect(async ()=>{
        async function doIt()
        {
            await axios.get('http://localhost:5000/api/academicMember/location',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setOptions2(items);
        }).catch(err=>alert(err))}
            await doIt();
        
        async function tableLoading()
        {
            await axios.get('http://localhost:5000/api/coordinator/theSlots',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setArr(items);
        }).catch(err=>alert(err))}
            await tableLoading();
        }, []  )

    //create slot stuff
    const [value1,setValue1]= useState("Select timing of slot");
    const [value2,setValue2]= useState("Select location of slot");
    const [value3,setValue3]= useState("Select day");

    const handleSelect1=(e)=>{
      setValue1(e)
    }
    const handleSelect2=(e)=>{
      setValue2(e)
    }
    const handleSelect3=(e)=>{
        setValue3(e)
      }

    const timing=["Select timing of slot","1st", "2nd", "3rd", "4th", "5th"];
    const days=["Select day", "Sataurday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    const items1= timing.map(elem=>
      {
          return <Dropdown.Item eventKey={elem}>{elem}</Dropdown.Item>
      })
      const items2= options2.map(elem=>
        {
            return <Dropdown.Item  eventKey={elem}>{elem}</Dropdown.Item>
        })
        const items3= days.map(elem=>
            {
                return <Dropdown.Item  eventKey={elem}>{elem}</Dropdown.Item>
            })
    //update delete stuff
    
      const createClick=()=>{
          if(value1!="Select timing of slot" && value2!="Select location of slot")
          {
              async function createSlots()
              {
                    await axios.post('http://localhost:5000/api/coordinator/addCourseSlot',{day:value3, slotNr:value1, slotLocation:value2},{headers:{'auth-token':token}}).then((res)=>{       
                    }).catch(err=>alert(err));
               }
                createSlots();
               window.location.reload(); 
          }
          else
          {
              alert("Cannot create slot!!! Please select a day, time and a location for your slot!!!")
          }
      }
    
    return (<div>
        <h1>Manage Course Slots</h1>
        <br></br>
        <Container>
        <Row>
            <Col>
            <div>
            <h5>Create Course Slot</h5>
            <p>Day</p>
            <DropdownButton onSelect={handleSelect3} id="dropdown-basic-button" variant="warning"  drop={"down"} title={value3}>
                {items3}
            </DropdownButton>
            <br></br>
            <p>Slot timing</p>
            <DropdownButton onSelect={handleSelect1} id="dropdown-basic-button" variant="warning"  drop={"down"} title={value1}>
                {items1}
            </DropdownButton>
            <br></br>
            <p>Location</p>
            <DropdownButton onSelect={handleSelect2} id="dropdown-basic-button" variant="warning"  drop={"down"} title={value2}>
                {items2}
            </DropdownButton>
            <br></br>
            <br></br>
            
            <Button onClick={createClick} variant="success">Create</Button>
            <br></br>
            <br></br>

            </div>
            </Col>
            <Col> 
            <div>
            <h5>Update and Delete Course Slots</h5>
            <TableScrollbar rows={6}>
            <Table style={{textAlign:"center"}} striped bordered hover> 
            <thead>
            <tr>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Taught by</th>
            <th>Location</th>
            <th>Update Slot</th>
            <th>Delete Slot</th>
            </tr>
            </thead>
            <tbody>
            {
              arr.map((elem,i)=>
                {
                return <RowComponent id={elem.id} day= {elem.Day} startTime= {elem.startTime.substring(3)} endTime={elem.endTime.substring(3)} taughtBy={elem.taughtBy} location={elem.location}/>
                })
            }
            </tbody>
            </Table>
            </TableScrollbar>
            </div>
            <br></br>
            </Col>
        </Row>
        </Container>
        
        </div>);
}

export default Slot;