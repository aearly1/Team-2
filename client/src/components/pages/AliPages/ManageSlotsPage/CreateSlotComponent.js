import React , {useState} from "react"
import DropDown from "./DropDown"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown, Button, Table} from 'react-bootstrap'
//Component for create slots
function CreateSlot()
{
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
    return (
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

      <Button variant="success">Create</Button>
    </div>)
}
export default CreateSlot;