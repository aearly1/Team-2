import React , {useState} from 'react'
import {Container, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { propTypes } from 'react-bootstrap/esm/Image';
import useToken from '../general/useToken'
import axios from 'axios';
function ModifySalary(props){
    const token = useToken().token


  const renderTooltip1 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
    Update base salary of Staff Member    
    </Tooltip>
    );
    

    const handleSubmit = (e1)=> {
        e1.preventDefault();
        axios.post('http://localhost:5000/api/hr/updateSalary',{'id':Id,'salary':Salary},{headers:{'auth-token':token}}).then((res)=>{
        alert(res.data)    
        }).catch(err=>alert(err))
        }
           
            const [Id,setID]= useState('');
 
            const changeID = (event) =>{
            setID(event.target.value)
            }

            const [Salary,setSalary]= useState('');
 
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
          New Salary:
          </label>
          <input required type="text" class="form-control" value={Salary} onChange={changeSalary} />
        
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
                    <Button variant="success" type="submit" >Update Salary </Button>
                </OverlayTrigger>
                                
      </form>
    )
}
/*
    check("office", "Staff member office must be a string").isString(),
    check("departmentName", "Staff member department must be a string").optional().isString(),
    check("facultyName", "Staff member faculty must be a string").optional().isString(),
*/
ModifySalary.propTypes = {
  IDs:PropTypes.array,
}

ModifySalary.defaultProps = {
  IDs:["ac-1","hr-1"]
};
export default ModifySalary