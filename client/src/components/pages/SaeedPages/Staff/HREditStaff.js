import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { propTypes } from 'react-bootstrap/esm/Image';
function EditStaff(props){

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
        alert('A name was submitted: ' + Id);
        e1.preventDefault();
        }
            const Types = ["HR","academic"];
            const subTypes = ["hod","instructor","ta"];
            const Days = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];
            const [Id,setID]= useState('');
            const [email,setEmail]= useState(null);
            const [name,setName]= useState(null);
            const [type,setType]= useState(null);
            const [subType,setSubType]= useState(null);
            const [office,setOffice]= useState(null);
            const [dayOff,setDayOff]= useState(null);
            const [Department,setDepartments]= useState(null);
            const [facultyName,setFacultyName]= useState(null);
            const [annualLeaves,setAnnualLeaves]= useState(null);
            const [accidentalLeavesLeft,setAccidentalLeavesLeft]= useState(null);
            const [Salary,setSalary]= useState(null);
   
            const changeID = (event) =>{
            setID(event)
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
            setOffice(event)
            }
        
        const changeDayOff = (event) =>{
            setDayOff(event)
            }
            
        const changeFaculty = (event) =>{
            setFacultyName(event)
            }
        
        const changeDepartments = (event) =>{
            setDepartments(event)
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
          <DropdownButton variant="warning" onSelect={changeID} id="dropdown-basic-button" title={(Id==='')?"Staff Member ID":Id}>
                {props.IDs.map(id => {
                      return <Dropdown.Item eventKey={id}>{id}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     
                <br/>
          <label>
          Email:
          </label>
          <input required type="email" class="form-control" value={email} onChange={changeEmail} />
        
        <br/>
        <label>
          Name:
          </label>
          <input required type="text" class="form-control" value={name} onChange={changeName} />
          <br/>
          <label>
          Type:
          </label>
          <DropdownButton variant="warning" onSelect={changeType} id="dropdown-basic-button" title={(type===null)?"Type":type}>
                {Types.map(Type => {
                      return <Dropdown.Item eventKey={Type}>{Type}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     
                <br/>
                <label>
          Sub Type:
          </label>
          <DropdownButton variant="warning" onSelect={changeSubType} id="dropdown-basic-button" title={(subType===null)?"SubType":subType}>
                {subTypes.map(SubType => {
                      return <Dropdown.Item eventKey={SubType}>{SubType}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     
                <br/>
                <label>
          Office:
          </label>
          <DropdownButton variant="warning" onSelect={changeOffice} id="dropdown-basic-button" title={(office===null)?"Office":office}>
                {props.Offices.map(Office => {
                      return <Dropdown.Item eventKey={Office}>{Office}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     
                <br/>
                <label>
          Day Off:
          </label>
          <DropdownButton variant="warning" onSelect={changeDayOff} id="dropdown-basic-button" title={(dayOff===null)?"DayOff":dayOff}>
                {Days.map(day => {
                      return <Dropdown.Item eventKey={day}>{day}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     
                <br/>
        <label>
          Faculty:
          </label>
          <DropdownButton variant="warning" onSelect={changeFaculty} id="dropdown-basic-button" title={(facultyName===null)?"Faculty":facultyName}>
                {props.Faculties.map(faculty => {
                      return <Dropdown.Item eventKey={faculty}>{faculty}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     <br/>
        <label>
          Departments:
          </label>
          <DropdownButton variant="warning" onSelect={changeDepartments} id="dropdown-basic-button" title={(Department===null)?"Departments ":Department}>
                {props.Departments.map(Department1 => {
                      return <Dropdown.Item eventKey={Department1}>{Department1}</Dropdown.Item>
                  }
                  )}
                </DropdownButton>     <br/>
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
