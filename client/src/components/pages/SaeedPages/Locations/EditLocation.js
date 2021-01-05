import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
function EditLocation(props){
const types = ["lab","office","tutorial room","lecture hall"];

    const handleSubmit = (e1)=> {
        alert('A name was submitted: ' + roomNr+" "+(type==null)+" "+capacity);
        e1.preventDefault();
        }
            const [roomNr,setRoomNr]= useState('');
            const [type,setType]= useState(null);
            const [capacity,setCapacity]= useState(null);
        const changeRoom = (event) =>{
            setRoomNr(event.target.value)
            }
        
        const changeType = (event) =>{
            setType(event)
            }
        const changeCapacity = (event) =>{
            setCapacity(event.target.value)
                }
    
    return (
   <form onSubmit={handleSubmit}>
        <label>
          Room Number:
          </label>
          <input type="text" class="form-control" required value={roomNr} onChange={changeRoom} />
        
        <br/>
        <label>
          New Room Type:
          </label>
          <DropdownButton variant="warning" onSelect={changeType} id="dropdown-basic-button" title={(type===null)?"Type ":type}>
                {types.map(type1 => {
                      return <Dropdown.Item eventKey={type1}>{type1}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     <br/>
        <label>
         New Room Capacity:
          </label>
            <input type="number" class="form-control" value={capacity} onChange={changeCapacity} />
        
        <br/>        <Button variant="success" type="submit"> Update Room  </Button>
      </form>
    )
}

export default EditLocation
