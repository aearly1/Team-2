import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import {Form,Button,Container, Row, Col, DropdownButton,Dropdown} from 'react-bootstrap'

function RequestsPage()
{
    const token = useToken().token
    var [sentTo,setSentTo] = useState(["Choose..."])
    var [sentToVal,setSentToVal] = useState("Choose...")
    const sentToHandler=(e)=>
    {
        setSentToVal(e.target.value)
    }
    var [slot,setSlot] = useState(["Choose..."])
    var [slotVal,setSlotVal] = useState("Choose...")
    const slotHandler=(e)=>
    {
        setSlotVal(e.target.value)
    }
    var [monthVal,setMonthVal] = useState("Choose Month...")
    const monthHandler=(e)=>
    {
        setMonthVal(e.target.value)
    }
    var [dayVal,setDayVal] = useState("Choose Day...")
    const dayHandler=(e)=>
    {
        setDayVal(e.target.value)
    }
    useEffect(async ()=>{
        //loading names of peers
        async function Peers()
        {
            await axios.get('http://localhost:5000/api/academicMember/peers',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setSentTo(items);
        }).catch(err=>alert(err))}
        await Peers();
        //loading slots
       async function Slots()
        {
            await axios.get('http://localhost:5000/api/academicMember/mySlots',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setSlot(items);
        }).catch(err=>alert(err))}
        await Slots();
        }, []  )

        //submit
        const submitHandler=(e)=>{
            if(sentToVal!="Choose..." && slotVal!="Choose..." && monthVal!="Choose..." && dayVal!="Choose...")
            {
                async function submit()
                {
                    await axios.post('http://localhost:5000/api/academicMember/replacementRequest',{"slotID":slotVal, "sendingRequestTo":sentToVal, "month":monthVal, "day":dayVal},{headers:{'auth-token':token}}).then((res)=>{
                }).catch(err=>alert(err))}
                submit();
                window.location.reload(true);
            }
            else
            {
                alert("Cannot submitt. One or more fields have not been filled in.")
            }
        }
      
    return (
        <div>
            <Form>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Request sent to</Form.Label>
            <Form.Control onChange={sentToHandler} as="select" value={sentToVal}>
            {
                sentTo.map
                (
                    elem=><option>{elem}</option>
                )
            }
            </Form.Control>
            </Form.Group>
        </Form.Row>
        <Form.Row>
        <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Slot for which a replacement is need</Form.Label>
            <Form.Control onChange={slotHandler} as="select" value={slotVal}>
            {
                slot.map
                (
                    elem=><option>{elem}</option>
                )
            }
            </Form.Control>
        </Form.Group>
        </Form.Row>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>Date of Replacement</Form.Label>
            <Form.Control onChange={monthHandler} as="select" defaultValue="Choose Month...">
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
            <Form.Label> </Form.Label>
            <Form.Control onChange={dayHandler} as="select" defaultValue="Choose Day...">
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
        </Form>
         <Button onClick={submitHandler} variant="primary" type="submit">
         Submit
        </Button>
        </div>
     );
}
export default RequestsPage