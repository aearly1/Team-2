import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import useToken from '../../general/useToken';
import axios from 'axios';

function DeleteLocation(props){
const token = useToken().token
  const types = ["lab","office","tutorial room","lecture hall"];

    const handleSubmit = (e1)=> {
        e1.preventDefault();
        axios.post('http://localhost:5000/api/hr/deleteLocation',{'roomNr':roomNr},{headers:{'auth-token':token}}).then((res)=>{
        alert(res.data)    
        }).catch(err=>alert(err))  
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
