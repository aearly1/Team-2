import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
function DeleteLocation(props){
const types = ["lab","office","tutorial room","lecture hall"];

    const handleSubmit = (e1)=> {
        alert('A name was submitted: ' + roomNr);
        e1.preventDefault();
        }
            const [roomNr,setRoomNr]= useState('');
        const changeRoom = (event) =>{
            setRoomNr(event.target.value)
            }
    
    return (
   <form onSubmit={handleSubmit}>
        <label>
          Room Number:
          </label>
          <input type="text" class="form-control" required value={roomNr} onChange={changeRoom} />
        
        <br/>
        <Button variant="danger" type="submit"> Delete Room  </Button>
      </form>
    )
}

export default DeleteLocation
