import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import {Form, Table, Button,Container, Row, Col, DropdownButton,Dropdown} from 'react-bootstrap'

function RequestPage()
{
    const token = useToken().token
    var [dayOffVal,setDayOffVal] = useState("Choose...")
    const dayOffHandler=(e)=>
    {
        setDayOffVal(e.target.value)
    }
    var [reason,setReason] = useState("Reason")
    const reasonHandler=(e)=>
    {
        setReason(e.target.value)
    }
    const submitHandler=(e)=>{
        if(dayOffVal!="Choose...")
        {
            async function submit()
            {
                await axios.post('http://localhost:5000/api/academicMember/changeDayOffRequest',{"reasonForChange":dayOffVal, "desiredDayOff":reason},{headers:{'auth-token':token}}).then((res)=>{
            }).catch(err=>alert(err))}
            submit();
            window.location.reload(true);
        }
        else
        {
            alert("Cannot submitt. One or more fields have not been filled in.")
        }
    }
    return(
        <div>
            <br></br>
            <Form>
            <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Desired Day Off</Form.Label>
            <Form.Control onChange={dayOffHandler} as="select" defaultValue="Choose...">
            <option>Choose...</option>
            <option>Sataurday</option>
            <option>Sunday</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            </Form.Control>
            </Form.Group>
        </Form.Row>
        <Form.Group controlId="formBasicReason">
            <Form.Label>Reason for change (optional)</Form.Label>
            <Form.Control onChange={reasonHandler} placeholder={reason} />
        </Form.Group>
        </Form>
        <Button onClick={submitHandler} variant="primary" type="submit">
            Submit
        </Button>
        </div>
    )
}

export default RequestPage