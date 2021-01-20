import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime-picker';

import useToken from '../general/useToken'
import axios from 'axios';
function AddMissingAttendance(props){
    const token = useToken().token


  const renderTooltip1 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
    Add missing sign in and sign out for the selected user   
    </Tooltip>
    );
    

    const handleSubmit = (e1)=> {
        e1.preventDefault();
        axios.post('http://localhost:5000/api/hr/addAttendanceRecord',{'id':Id,'attendanceRecord':attendanceRecord},{headers:{'auth-token':token}}).then((res)=>{
        alert(res.data)    
        }).catch(err=>alert(err))
      }
           
            const [Id,setID]= useState('');
 
            const changeID = (event) =>{
            setID(event.target.value)
            }

            const [inDate,setInDate]= useState();
            const [outDate,setOutDate]= useState();
            const [attendanceRecord,setRecord]= useState([{ "op": "sign in",'time':new Date()},{ "op": "sign out",'time':new Date()}]);
 
            const changeDate1 = (event)=>
            {
              setInDate(event)
              setRecord([{ "op": "sign in",'time':event},attendanceRecord[1]])
            }
            const changeDate2 = (event)=>
            {
              setOutDate(event)
              setRecord([attendanceRecord[0],{ "op": "sign out",'time':event}])
            }


    return (
   <form onSubmit={handleSubmit}>
         <label>
          Staff Member ID:
          </label>
          <input required type="text" class="form-control" value={Id} onChange={changeID} />
        
        <br/>
        <label>
           Sign-in Date:   
          </label>
          {'   '+'   '+'   '}
          <DateTimePicker
          disableClock ={true}
        onChange={changeDate1}
        value={inDate}
      />       
        <br/>
        <label>
          Sign-Out Date:   
          </label>
          {'   '+'   '+'   '}
          <DateTimePicker
          disableClock ={true}
        onChange={changeDate2}
        value={outDate}
      />       
        <br/>

                <hr  style={{
                    color: '#0C0A3E',
                    backgroundColor: '#0C0A3E',
                    height: 1,
                    borderColor : '#0C0A3E'
                }}/>
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip1}
                >
                    <Button variant="success" type="submit" > Add Missing Attendance </Button>
                </OverlayTrigger>
                                
      </form>
    )
}
/*
    check("office", "Staff member office must be a string").isString(),
    check("departmentName", "Staff member department must be a string").optional().isString(),
    check("facultyName", "Staff member faculty must be a string").optional().isString(),
*/

export default AddMissingAttendance