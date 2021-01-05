import React , {useState} from "react"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown, Button, Table} from 'react-bootstrap'

function DropDown(props)
{
    const [value1,setValue1]= useState(props.text);
    
    const handleSelect1=(e)=>{
      setValue1(e)
    }
    const array = props.array
    const items= array.map(elem=>
    {
        return <Dropdown.Item eventKey={elem}>{elem}</Dropdown.Item>
    })
    return(
        <DropdownButton onSelect={handleSelect1} id="dropdown-basic-button" variant="warning"  drop={"down"} title={value1}>
        {items}
        </DropdownButton>
    )
}
export default DropDown;