import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { propTypes } from 'react-bootstrap/esm/Image';
import useToken from '../../general/useToken'
import axios from 'axios';

function EditStaff(props){
const token = useToken().token
   /*check("email", "Staff member email must be an email").isEmail(),
    check("name", "Staff member name must be a string").isString(),
    check("type", "Staff member type must be a string").isString(),
    check("subType", "Staff member subType must be a string").optional().isString(),
    check("office", "Staff member office must be a string").isString(),
    check("dayOff", "Staff member day off must be a string").optional().isString(),
    check("departmentName", "Staff member department must be a string").optional().isString(),
    check("facultyName", "Staff member faculty must be a string").optional().isString(),
    check("annualLeaves", "Staff member annual leaves must be a number").optional().isNumeric(),
    check("accidentalLeavesLeft", "Staff member accidental leaves left must be a number").optional().isNumeric(),
    check("Salary", "Staff member Salary must be a number").isNumeric()*/

    const handleSubmit = (e1)=> {
        e1.preventDefault();
        axios.post('http://localhost:5000/api/hr/editStaffMember',{'id':Id,'email':email,
        'name':name,
        'type':type,
        'subType':subType,
        'office':office,
        'dayOff':dayOff,
        'departmentName':Department,
        'facultyName':facultyName,
        'annualLeaves':annualLeaves,
        'accidentalLeavesLeft':accidentalLeavesLeft,
        'Salary':Salary
        },{headers:{'auth-token':token}}).then((res)=>{
            alert(res.data)    
            }).catch(err=>alert(err))
            }
            const [Id,setID]= useState('');
            const Types = ["HR","academic"];
            const subTypes = ["hod","instructor","ta"];
            const Days = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];
            const [email,setEmail]= useState('');
            const [name,setName]= useState('');
            const [type,setType]= useState('');
            const [subType,setSubType]= useState('');
            const [office,setOffice]= useState('');
            const [dayOff,setDayOff]= useState('');
            const [Department,setDepartments]= useState('');
            const [facultyName,setFacultyName]= useState('');
            const [annualLeaves,setAnnualLeaves]= useState();
            const [accidentalLeavesLeft,setAccidentalLeavesLeft]= useState();
            const [Salary,setSalary]= useState();
   
            const changeID = (event) =>{
            setID(event.target.value)
            }
         const changeEmail = (event) =>{
            setEmail(event.target.value)
            }
        
        const changeName = (event) =>{
            setName(event.target.value)
            }

        const changeType = (event) =>{
            setType(event)
            }
        
        const changeSubType = (event) =>{
            setSubType(event)
            }            
        const changeOffice = (event) =>{
            setOffice(event.target.value)
            }
        
        const changeDayOff = (event) =>{
            setDayOff(event)
            }
            
        const changeFaculty = (event) =>{
            setFacultyName(event.target.value)
            }
        
        const changeDepartments = (event) =>{
            setDepartments(event.target.value)
            }            
        const changeAnnualLeaves = (event) =>{
            setAnnualLeaves(event.target.value)
            }
        
        const changeAccidentalLeavesLeft = (event) =>{
            setAccidentalLeavesLeft(event.target.value)
            }            

        const changeSalary = (event) =>{
            setSalary(event.target.value)
            }            
    


    return (
   <form onSubmit={handleSubmit}>
         <label>
          Staff Member ID:
          </label>
          <input required type="text" class="form-control" value={Id} onChange={changeID} />
                <br/>
          <label>
          Email:
          </label>
          <input  type="email" class="form-control" value={email} onChange={changeEmail} />
        
        <br/>
        <label>
          Name:
          </label>
          <input  type="text" class="form-control" value={name} onChange={changeName} />
          <br/>
          <label>
          Type:
          </label>
          <DropdownButton variant="warning" onSelect={changeType} id="dropdown-basic-button" title={(type==='')?"Type":type}>
                {Types.map(Type => {
                      return <Dropdown.Item eventKey={Type}>{Type}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     
                <br/>
                <label>
          Sub Type:
          </label>
          <DropdownButton variant="warning" onSelect={changeSubType} id="dropdown-basic-button" title={(subType==='')?"SubType":subType}>
                {subTypes.map(SubType => {
                      return <Dropdown.Item eventKey={SubType}>{SubType}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     
                <br/>
                <label>
          Office:
          </label>
          <input  type="text" class="form-control" value={office} onChange={changeOffice} />
            <br/>
                <label>
          Day Off:
          </label>
          <DropdownButton variant="warning" onSelect={changeDayOff} id="dropdown-basic-button" title={(dayOff==='')?"DayOff":dayOff}>
                {Days.map(day => {
                      return <Dropdown.Item eventKey={day}>{day}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     
                <br/>
        <label>
          Faculty:
          </label>
          <input  type="text" class="form-control" value={facultyName} onChange={changeFaculty} />
        <br/>
        <label>
          Departments:
          </label>
          <input  type="text" class="form-control" value={Department} onChange={changeDepartments} />
        <br/>
                <label>
          Annual Leaves:
          </label>
          <input type="number" class="form-control" value={annualLeaves} onChange={changeAnnualLeaves} />
          <br/>
          <label>
          Accidental Leaves Left:
          </label>
          <input type="number" class="form-control" value={accidentalLeavesLeft} onChange={changeAccidentalLeavesLeft} />
          <br/>
          <label>
          Salary:
          </label>
          <input type="number" class="form-control" value={Salary} onChange={changeSalary} />
          <br/>
                <Button variant="success" type="submit"> Update Staff Member  </Button>
                <br/>
                <br/>
                <br/>
      </form>
    )
}
/*
    check("office", "Staff member office must be a string").isString(),
    check("departmentName", "Staff member department must be a string").optional().isString(),
    check("facultyName", "Staff member faculty must be a string").optional().isString(),
*/
EditStaff.propTypes = {
  IDs:PropTypes.array,
  Offices:PropTypes.array,
  Departments: PropTypes.array,
  Faculties: PropTypes.array
}

EditStaff.defaultProps = {
  IDs:["ac-1","hr-1"],
  Offices:["c3.101","c5.201","c2,301"],
  Departments: ['CSEN','DMET','MECHA'],
  Faculties: ['MET','EMS','IET']
};
export default EditStaff
