import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { propTypes } from 'react-bootstrap/esm/Image';
import useToken from '../../general/useToken'
import axios from 'axios';

function DeleteStaff(props){
const token = useToken().token
    const handleSubmit = (e1)=> {
      e1.preventDefault();
      axios.post('http://localhost:5000/api/hr/deleteStaffMember',{'id':Id},{headers:{'auth-token':token}}).then((res)=>{
      alert(res.data)    
      }).catch(err=>alert(err))  
        }
           
            const [Id,setID]= useState('');
 
            const changeID = (event) =>{
            setID(event.target.value)
            }

    return (
   <form onSubmit={handleSubmit}>
         <label>
          Staff Member ID:
          </label>
          <input required type="text" class="form-control" value={Id} onChange={changeID} />
                   <br/>

                <Button variant="danger" type="submit"> Delete Staff Member  </Button>

      </form>
    )
}
/*
    check("office", "Staff member office must be a string").isString(),
    check("departmentName", "Staff member department must be a string").optional().isString(),
    check("facultyName", "Staff member faculty must be a string").optional().isString(),
*/

export default DeleteStaff
