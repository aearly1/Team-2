import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import DropDown from "./DropDown"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown, Button, Table} from 'react-bootstrap'

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
    const [drop1,setDrop1]= useState([]);
    const [drop2,setDrop2]= useState([]);
    const handleSelect1=(e)=>{
      setValue1(e)
    }
    const handleSelect2=(e)=>{
      setValue2(e)
    }
    const handleSelect3=(e)=>{
        setValue3(e)
      }

    const timing=["1st", "2nd", "3rd", "4th", "5th"];
    const days=["Sataurday", "Sunday", "Monday", "Tuesday", "Wedneday", "Thursday"];
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
    /*const array = [{Day: "TUES", startTime: "8:15 AM", endTime: "10:00 AM", taughtBy: ["Loaa Elzahar","Walid Elhefny"], location: ["C3. 201", "C3. 103", "C6. 204", "C5. 112"]},
    {Day: "WED", startTime: "1:45 AM", endTime: "3:15 PM", taughtBy: ["Loaa Elzahar","Walid Elhefny"], location: ["C3. 201", "C3. 103", "C6. 204", "C5. 112"]},
    {Day: "THURS", startTime: "8:15 AM", endTime: "10:00 AM", taughtBy: ["Loaa Elzahar","Walid Elhefny"], location: ["C3. 201", "C3. 103", "C6. 204", "C5. 112"]}];*/
    
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
      }
      const updateClick=(e)=>{
        var index = e.target.id
        async function updateSlots()
              {
                    await axios.post('http://localhost:5000/api/coordinator/updateCourseSlot',{slotID:index},{headers:{'auth-token':token}}).then((res)=>{       
                    }).catch(err=>alert(err));
               }
            updateSlots();
            window.location.reload(); 
    }
      const deleteClick=(e)=>{
        var index = e.target.id
        async function deleteSlots()
              {
                    await axios.post('http://localhost:5000/api/coordinator/deleteCourseSlot',{slotID:index},{headers:{'auth-token':token}}).then((res)=>{       
                    }).catch(err=>alert(err));
               }
                deleteSlots();
               window.location.reload(); 
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
            </div>
            </Col>
            <Col> 
            <div>
            <h5>Update and Delete Course Slots</h5>
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
                return(
                <tr>
                <td>{elem.Day}</td>
                <td>{elem.startTime.substring(3)}</td>
                <td>{elem.endTime.substring(3)}</td>
                <td><DropdownButton onSelect={handleSelect1} id="dropdown-basic-button" variant="warning"  drop={"down"} title={value1}>
                     {elem.taughtBy.map(elem2=> {return <Dropdown.Item eventKey={elem2}>{elem2}</Dropdown.Item>})}
                </DropdownButton></td>
                <td><DropdownButton onSelect={handleSelect1} id="dropdown-basic-button" variant="warning"  drop={"down"} title={value1}>
                {elem.location.map(elem2=> {return <Dropdown.Item eventKey={elem2}>{elem2}</Dropdown.Item>})}
                </DropdownButton></td>
                <td>
                <>
                <OverlayTrigger placement="bottom"
                    overlay={
                        <Tooltip id={`tooltip-${'bottom'}`}>
                        By clicking this button, the slot location and the staff member teaching the slot will be updated wth the values selected in the drop down menus. If you want either of the two values to remain the same, do NOT select any of the options in the corresponding drop down menu.
                        </Tooltip>
                    }
                    >
                    <Button Button id={elem.id+"-"+i} onClick={updateClick} variant="info">Update</Button>
                    </OverlayTrigger>
                </>
                </td>
                <td>
                <>
                <OverlayTrigger placement="bottom"
                    overlay={
                        <Tooltip id={`tooltip-${'bottom'}`}>
                        By clicking this button, the course slot will be deleted.
                        </Tooltip>
                    }
                    >
                    <Button id={elem.id} onClick={deleteClick} variant="danger">Delete</Button>
                    </OverlayTrigger>
                </>
                </td>
            
                </tr>)
                })
            }
            </tbody>
            </Table>
            </div>
            <br></br>
            </Col>
        </Row>
        </Container>
        
        </div>);
}

export default Slot;