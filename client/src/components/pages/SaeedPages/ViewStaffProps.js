import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { propTypes } from 'react-bootstrap/esm/Image';
import useToken from '../general/useToken'
import axios from 'axios';
function ViewAttendance(props){
    const token = useToken().token
    

  const renderTooltip1 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        View the attendance of the staff member with the selected id
    </Tooltip>
    );
    const renderTooltip2 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
       View staff members with missing days or hours 
         </Tooltip>
    );
    const renderTooltip3 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
              View the Salary after deductions of the staff member with the selected id
    </Tooltip>
    );


    const handleSubmit = (e1)=> {
        e1.preventDefault();
        if(btn == 1)
{        axios.post('http://localhost:5000/api/hr/viewAttendance',{'id':Id},{headers:{'auth-token':token}}).then((res)=>{
        setAttendance(res.data)
        setDays([])
        setSalary('')
    }).catch(err=>alert(err))
       }

        if(btn == 2)
        axios.post('http://localhost:5000/api/hr/viewMissingDaysOrHours',{},{headers:{'auth-token':token}}).then((res)=>{
        setDays(res.data)    
        setAttendance([])
        setSalary('')    
         }).catch(err=>alert(err))
        if(btn == 3)
        axios.post('http://localhost:5000/api/hr/viewSalary',{'id':Id},{headers:{'auth-token':token}}).then((res)=>{
        setSalary(res.data)    
        setDays([])
        setAttendance([])
        }).catch(err=>alert(err))
        }
           
            const [Id,setID]= useState('');
            const [Attendance,setAttendance]= useState([]);
            const [Days,setDays]= useState([]);
            const [Salary,setSalary]= useState('');
 
            const changeID = (event) =>{
            setID(event.target.value)
            }

            const [btn,setBtn]= useState(1);
 
            const changeAtt = (event) =>{
            setBtn(1)
            }
 
            const changeMD = (event) =>{
            setBtn(2)
            }
 
            const changeSalary = (event) =>{
            setBtn(3)
            }

    return (
        <div>   <form onSubmit={handleSubmit}>
         <label>
          Staff Member ID:
          </label>
          <input type="text" class="form-control" value={Id} onChange={changeID} />
        
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
                    <Button variant="success" type="submit" onClick={changeAtt}>View Attendance </Button>
                </OverlayTrigger>
                                
                {' '}
                    <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip2}
                >
                    <Button variant="info" type="submit" onClick={changeMD}> View Missing Days </Button>
                </OverlayTrigger>
                
                {' '}
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip3}
                >
                    <Button variant="danger" type="submit"onClick={changeSalary}>View Salary  </Button>
                </OverlayTrigger>
      </form>
      <br/>
      <label>
          Attendance:
          </label>
        <br/>
        <ul>
            {Attendance.map((r)=>{
                return <li style={{marginLeft:"10px"}}>{r.time.toLocaleString()+', '+r.op}</li>
            })}
        </ul>
     <br/>
      <label>
          Staff Members with missing days or hours:
          </label>
        <br/>
        <ul>
            {Days.map((r)=>{
                return <li style={{marginLeft:"10px"}}>{r}</li>
            })}
        </ul>
        <br/>
        <label>
          Salary:
          </label>
          <p> {Salary}</p>
        </div>


)
}
/*
    check("office", "Staff member office must be a string").isString(),
    check("departmentName", "Staff member department must be a string").optional().isString(),
    check("facultyName", "Staff member faculty must be a string").optional().isString(),
*/
ViewAttendance.propTypes = {
  IDs:PropTypes.array,
}

ViewAttendance.defaultProps = {
  IDs:["ac-1","hr-1"]
};
export default ViewAttendance