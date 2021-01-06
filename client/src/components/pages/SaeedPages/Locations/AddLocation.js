import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import useToken from '../../general/useToken';
import axios from 'axios';
function AddLocation(props){
  const token = useToken().token

const types = ["lab","office","tutorial room","lecture hall"];

    const handleSubmit = (e1)=> {
         e1.preventDefault();
        axios.post('http://localhost:5000/api/hr/addLocation',{'roomNr':roomNr,'roomType':type,'capacity':capacity},{headers:{'auth-token':token}}).then((res)=>{
          alert(res.data)    
          }).catch(err=>alert(err))  
      }
            const [roomNr,setRoomNr]= useState('');
            const [type,setType]= useState('');
            const [capacity,setCapacity]= useState(0);
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
          <input required type="text" class="form-control" value={roomNr} onChange={changeRoom} />
        
        <br/>
        <label>
          Room Type:
          </label>
          <DropdownButton variant="warning" onSelect={changeType} id="dropdown-basic-button" title={(type==="")?"Type ":type}>
                {types.map(type1 => {
                      return <Dropdown.Item eventKey={type1}>{type1}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     <br/>
        <label>
          Room Capacity:
          </label>
            <input required type="number" class="form-control" value={capacity} onChange={changeCapacity} />
        
        <br/>        <Button variant="success" type="submit"> Add Room  </Button>
      </form>
    )
}

export default AddLocation
