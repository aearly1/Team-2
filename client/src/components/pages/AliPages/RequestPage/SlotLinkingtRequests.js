import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import {Table, Button,Container, Row, Col, DropdownButton,Dropdown} from 'react-bootstrap'
function findDay(val)
{
    if(val==1)
    {
        return "Saturday"
    }
    else if(val==2)
    {
        return "Sunday"
    }
    else if(val==3)
    {
        return "Monday"       
    }
    else if(val==4)
    {
        return "Tuesday"      
    }
    else if(val==5)
    {
        return "Wednesday"      
    }
    else if(val==6)
    {
        return "Thursday"      
    }
    else if(val==7)
    {
        return "Friday"      
    }
}
function Requestpage()
{
    const token = useToken().token
    var [arr,setArr] = useState([])

    useEffect(async ()=>{
        //loading slots
        async function slots()
        {
            await axios.get('http://localhost:5000/api/academicMember/unassignedslots',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setArr(items);
        }).catch(err=>alert(err))}
        await slots();
        }, []  )

        const submitHandler=(e)=>{
            const index=e.target.id
            async function submit()
            {
                await axios.post('http://localhost:5000/api/academicMember/slotLinkingRequest',{"slotID":index},{headers:{'auth-token':token}}).then((res)=>{
            }).catch(err=>alert(err))}
            submit();
            alert("Request submitted")
        }

    return(
        <div>
            <br></br>
            <div>
            <h5>Kindly find bellow the unassigned slots of the course</h5>
            <Table style={{textAlign:"center"}} striped bordered hover> 
            <thead>
            <tr>
            <th>Day</th>
            <th>Slot</th>
            <th>Location</th>
            <th>Course</th>
            <th>Request Linking</th>
            </tr>
            </thead>
            <tbody>
            {
                arr.map(elem=>
                    {
                        return(
                        <tr>
                        <td>{findDay(elem.day)}</td>
                        <td>{elem.slotNr}</td>
                        <td>{elem.location}</td>
                        <td>{elem.course}</td>
                        <td><Button id={elem.id} onClick={submitHandler} variant="success">Submit</Button></td>
                        </tr> 
                        )
                    })
            }
            </tbody>
            </Table>
            </div>
        </div>
    )
}
export default Requestpage