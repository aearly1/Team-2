import React , {useState} from "react"
import RowComponent from "./RowComponent"
import CreateSlot from "./CreateSlotComponent"
import UpdateDeleteSlot from "./UpdateDeleteSlot"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown, Button, Table} from 'react-bootstrap'

//slot page component
function Slot()
{
    //create slot stuff
    const [value1,setValue1]= useState("Select timing of slot");
    const [value2,setValue2]= useState("Select location of slot");
    const handleSelect1=(e)=>{
      setValue1(e)
    }
    const handleSelect2=(e)=>{
      setValue2(e)
    }

    const timing=["8:15 AM - 9:45 AM", "10:00 AM - 11:30 AM", "11:45 AM - 1:15 AM", "1:45 AM - 3:15 AM", "3:45 AM - 5:15 AM"];
    const location=["C3. 201", "C3. 103", "C6. 204", "C5. 112"];
    const items1= timing.map(elem=>
      {
          return <Dropdown.Item eventKey={elem}>{elem}</Dropdown.Item>
      })
      const items2= location.map(elem=>
        {
            return <Dropdown.Item eventKey={elem}>{elem}</Dropdown.Item>
        })
    //update delete stuff
    const array = [{Day: "TUES", startTime: "8:15 AM", endTime: "10:00 AM", taughtBy: ["Loaa Elzahar","Walid Elhefny"], location: ["C3. 201", "C3. 103", "C6. 204", "C5. 112"]},
    {Day: "WED", startTime: "1:45 AM", endTime: "3:15 PM", taughtBy: ["Loaa Elzahar","Walid Elhefny"], location: ["C3. 201", "C3. 103", "C6. 204", "C5. 112"]},
    {Day: "THURS", startTime: "8:15 AM", endTime: "10:00 AM", taughtBy: ["Loaa Elzahar","Walid Elhefny"], location: ["C3. 201", "C3. 103", "C6. 204", "C5. 112"]}];
    var tableRows= array.map(elem=>
    {
    return <RowComponent 
    day={elem.Day}
    startTime={elem.startTime} 
    endTime={elem.endTime}
    taughtBy={elem.taughtBy}
    location={elem.location}
    />
    })
    const [arr,setArr]= useState(tableRows);
    const handleClick=()=>{
            let newArr= arr
            newArr.push(<RowComponent 
            day={"Purple Day"}
            startTime={8} 
            endTime={10}
            taughtBy={["Loaa Elzahar","Walid Elhefny"]}
            location={["C3. 201", "C3. 103", "C6. 204", "C5. 112"]}
            />)
        setArr(newArr)
      }
    return (<div>
        <h1>Manage Course Slots</h1>
        <br></br>
        <Container>
        <Row>
            <Col>
            <div>
            <h5>Create Course Slot</h5>
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
            <Button onClick={handleClick} variant="success">Create</Button>
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
            {arr}
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