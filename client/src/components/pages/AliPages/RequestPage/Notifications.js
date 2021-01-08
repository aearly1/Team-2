import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'

import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

//component for updating and deleting slots
function Notifiactions()
{   
    const token = useToken().token
    const [arr,setArr]= useState([]);
    useEffect(async ()=>{
        //loading replacement requests upon loading the page
        async function Notifications()
        {
            await axios.get('http://localhost:5000/api/academicMember/notifications',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setArr(items);
        }).catch(err=>alert(err))}
        await Notifications();
        }, []  )
    return (
    <div>
    <h5>  </h5>
    <Table style={{textAlign:"center"}} striped bordered hover> 
    <thead>
    <tr>
    <th>Notifications</th>
    </tr>
    </thead>
    <tbody style={{display: "block", height: 650, overflow: "scroll"}}>
    {
        arr.map(elem=>
            {
                var accepted=false;
                const splitted=elem.split(" ")
                for(const elem2 of splitted)
                {
                    if(elem2=="accepted")
                    {
                        accepted=true;break;
                    }
                }
                var color=accepted?"#5cb85c":"#d9534f";
            return (
            <tr style={{backgroundColor: color, color:"white"}}><td>{elem}</td></tr>
            )})
    }
    </tbody>
    </Table>
    </div>
);
}

export default Notifiactions