import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import {Form, Table, Button,Container, Row, Col, DropdownButton,Dropdown} from 'react-bootstrap'

 function Page()
 {
    const token = useToken().token
    var [leaveType,setleaveType] = useState("Choose...")
    const leaveTypeHandler=(e)=>
    {
        setleaveType(e.target.value)
    }
    var [reason,setReason] = useState("")
    const reasonHandler=(e)=>
    {
        setReason(e.target.value)
    }
    var [link,setLink] = useState("")
    const linkHandler=(e)=>
    {
        setLink(e.target.value)
    }
    var [replacement,setReplacement] = useState("")
    const replacementHandler=(e)=>
    {
        setReplacement(e.target.value)
    }
    var [startDay,setStartDay] = useState("Choose Day...")
    const startDayHandler=(e)=>
    {
        setStartDay(e.target.value)
    }
    var [startMonth,setStartMonth] = useState("Choose Month...")
    const startMonthHandler=(e)=>
    {
        setStartMonth(e.target.value)
    }
    var [endDay,setEndDay] = useState("Choose Day...")
    const endDayHandler=(e)=>
    {
        setEndDay(e.target.value)
    }
    var [endMonth,setEndMonth] = useState("Choose Month...")
    const endMonthHandler=(e)=>
    {
        setEndMonth(e.target.value)
    }
    const submitHandler=(e)=>{
        if(leaveType=="Choose..." || startMonth=="Choose Month..." || endMonth=="Choose Month..." || startDay=="Choose Day..." || endDay=="Choose Day..." || (leaveType=="Compensation Leaves" && reason=="") || ((leaveType=="Maternity Leaves" || leaveType=="Sick Leaves") && link==""))
        {
            alert("Cannot submitt. One or more fields have not been filled in.")
        }
        else
        {
            async function submit()
            {
                await axios.post('http://localhost:5000/api/academicMember/leave',
                {"documents": link,
                "reason": reason,
                "leaveType": leaveType,
                "replacementStaff": replacement,
                "startMonth": startMonth,
                "startDay": startDay,
                "endMonth": endMonth,
                "endDay": endDay},
                {headers:{'auth-token':token}}).then((res)=>{
            }).catch(err=>alert(err))}
            submit();
            window.location.reload(true);
        }
    }
    return (
        <div>
            <Form>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Leave Type</Form.Label>
            <Form.Control onChange={leaveTypeHandler} as="select" defaultValue="Choose...">
            <option>Choose...</option>
            <option>Annual Leaves</option>
            <option>Accidental Leaves</option>
            <option>Sick Leaves</option>
            <option>Maternity Leaves</option>
            <option>Compensation Leaves</option>
            </Form.Control>
            </Form.Group>
        </Form.Row>

        <Form.Group onChange={reasonHandler}controlId="formGridAddress1">
            <Form.Label>Reason for leave (Mandatory for compensation leave)</Form.Label>
            <Form.Control as="textarea" rows={3} />
        </Form.Group>

        <Form.Group onChange={linkHandler} controlId="formGridAddress2">
            <Form.Label>Google Drive Link to Uploaded Documents (in case of sick and maternity leaves)</Form.Label>
            <Form.Control placeholder="" />
        </Form.Group>
        <Form.Group onChange={replacementHandler} controlId="formGridAddress2">
            <Form.Label>Replacement Staff Name (in case of replacement staff and if applicable)</Form.Label>
            <Form.Control placeholder="" />
        </Form.Group>

        <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>Start Day of Leave</Form.Label>
            <Form.Control onChange={startDayHandler} as="select" defaultValue="Choose...">
            <option>Choose Day...</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
            <option>24</option>
            <option>25</option>
            <option>26</option>
            <option>27</option>
            <option>28</option>
            <option>29</option>
            <option>30</option>
            <option>31</option>
            </Form.Control>
            </Form.Group>
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>Start Date of Leave</Form.Label>
            <Form.Control onChange={startMonthHandler} as="select" defaultValue="Choose...">
            <option>Choose Month...</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            </Form.Control>
            </Form.Group>
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="formGridState">
            <Form.Label>End Day of Leave</Form.Label>
            <Form.Control onChange={endDayHandler} as="select" defaultValue="Choose...">
            <option>Choose Day...</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
            <option>24</option>
            <option>25</option>
            <option>26</option>
            <option>27</option>
            <option>28</option>
            <option>29</option>
            <option>30</option>
            <option>31</option>
            </Form.Control>
            </Form.Group>
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>Start Date of Leave</Form.Label>
            <Form.Control onChange={endMonthHandler} as="select" defaultValue="Choose...">
            <option>Choose Month...</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            </Form.Control>
            </Form.Group>
        </Form.Row>
        </Form>
        <Button onClick={submitHandler} variant="primary" type="submit">
            Submit
        </Button>
        </div>
    )
 }
export default Page