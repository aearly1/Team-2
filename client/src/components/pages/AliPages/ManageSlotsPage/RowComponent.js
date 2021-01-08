import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown, Button, Table} from 'react-bootstrap'

//component for the rows inside the table
function RowComponent(props)
{
    const token = useToken().token

    const [value1,setValue1]= useState("Select Staff Teaching Slot");

    const handleSelect1=(e)=>{
      setValue1(e)
    }

    const [value2,setValue2]= useState("Select Location of Slot");

    const handleSelect2=(e)=>{
      setValue2(e)
    }

    const updateClick=(e)=>{
        var index = e.target.id
        async function updateSlots()
              {
                    if(value1=="Select Staff Teaching Slot" && value2=="Select Location of Slot")
                    {
                        alert("You did not select the values to be updated from the dropdown menus. You must at least select one value")
                    }
                    else if(value1=="Select Staff Teaching Slot")
                    {
                        await axios.put('http://localhost:5000/api/coordinator/updateCourseSlot',{"slotID":index, "slotLocation":value2},{headers:{'auth-token':token}}).then((res)=>{       
                        }).catch(err=>alert(err));
                        alert("slot updated") 
                    }
                    else if(value2=="Select Location of Slot")
                    {
                        await axios.put('http://localhost:5000/api/coordinator/updateCourseSlot',{"slotID":index, "staffTeachingSlot":value1},{headers:{'auth-token':token}}).then((res)=>{       
                        }).catch(err=>alert(err));
                        alert("slot updated") 
                    }
                    else
                    {
                        await axios.put('http://localhost:5000/api/coordinator/updateCourseSlot',{"slotID":index, "staffTeachingSlot":value1, "slotLocation":value2},{headers:{'auth-token':token}}).then((res)=>{       
                        }).catch(err=>alert(err));
                        alert("slot updated") 
                    }
               }
            updateSlots();
            
    }

    const deleteClick=(e)=>{
        var index = e.target.id
        async function deleteSlots()
              {
                    await axios.post('http://localhost:5000/api/coordinator/deleteCourseSlot',{slotID:index},{headers:{'auth-token':token}}).then((res)=>{       
                    }).catch(err=>alert(err));
               }
                deleteSlots();
               window.location.reload(true); 
    }

    return (
        <tr>
        <td>{props.day}</td>
        <td>{props.startTime}</td>
        <td>{props.endTime}</td>
        <td><DropdownButton onSelect={handleSelect1} id="dropdown-basic-button" variant="warning"  drop={"down"} title={value1}>{props.taughtBy.map(elem2=> {return <Dropdown.Item eventKey={elem2}>{elem2}</Dropdown.Item>})}</DropdownButton></td>
        <td><DropdownButton onSelect={handleSelect2} id="dropdown-basic-button" variant="warning"  drop={"down"} title={value2}>{props.location.map(elem2=> {return <Dropdown.Item eventKey={elem2}>{elem2}</Dropdown.Item>})}</DropdownButton></td>
        <td>
        <>
        <OverlayTrigger placement="bottom"
            overlay={
                <Tooltip id={`tooltip-${'bottom'}`}>
                By clicking this button, the slot location and the staff member teaching the slot will be updated wth the values selected in the drop down menus. If you want either of the two values to remain the same, do NOT select any of the options in the corresponding drop down menu.
                </Tooltip>
            }
            >
            <Button id={props.id} onClick={updateClick} variant="info">Update</Button>
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
            <Button variant="danger"  id={props.id} onClick={deleteClick}>Delete</Button>
            </OverlayTrigger>
        </>
        </td>
    
        </tr>
    );
}

export default RowComponent;