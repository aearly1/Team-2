import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import useToken from '../../general/useToken';
import axios from 'axios';
import Select from 'react-select'
function AddFaculty(props){


  const token = useToken().token  

    const handleSubmit = (e1)=> {
      e1.preventDefault();
      let IDS = Department.map(d=>d.value) 
      axios.post('http://localhost:5000/api/hr/editFaculty',{'facultyName':facultyName,'departments':IDS},{headers:{'auth-token':token}}).then((res)=>{
      alert(res.data)    
      }).catch(err=>alert(err))        }
            const [facultyName,setFacultyName]= useState('');
            const [Departments,setDep]= useState();
            const [options,setOptions] = useState([]);
            const [Department,setDepartment]= useState();
            const [Ids,setID]= useState();
        const changeFaculty = (event) =>{
            setFacultyName(event.target.value)
            }
        


          const Refresh = (event)=>{
            axios.get('http://localhost:5000/api/hr/getDepartments',{headers:{'auth-token':token}}).then((res)=>{
              setID(res.data[1]);
              setDep(res.data[0]);
              let op = []
              for(let i=0;i<Departments.length;i++){
                op[i] = {label:Departments[i],value:Ids[i]}
               }
              setOptions(op)
             }).catch(err=>console.log(err))   
          }
                
    return (
   <form onSubmit={handleSubmit}>
        <label>
          Faculty Name:
          </label>
          <input required type="text" class="form-control" value={facultyName} onChange={changeFaculty} />
        
        <br/>
        <label>
          Departments:
          </label>
          <Select calss= "form-control" onChange={setDepartment} value ={Department} options={options} isMulti />  <br/>  <Button variant="outline-info" onClick={Refresh}>Refresh Departments</Button>

          <br/>
          <br/>
          <br/>
                <Button variant="success" type="submit"> Update Faculty  </Button>
      </form>
    )
}

export default AddFaculty
