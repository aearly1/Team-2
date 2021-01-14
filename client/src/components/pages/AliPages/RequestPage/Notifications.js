import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import TableScrollbar from 'react-table-scrollbar';

import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

//component for updating and deleting slots
function Notifiactions()
{   
    const token = useToken().token
    const [arr,setArr]= useState([]);
    useEffect(async ()=>{
        const intervalId = setInterval(() => {  
              //loading replacement requests upon loading the page
        function Notifications()
        {
            axios.get('http://localhost:5000/api/academicMember/notifications',{headers:{'auth-token':token}}).then((res)=>{
            let items=res.data;
            setArr(items);
        }).catch(err=>alert(err))}
         Notifications();
          }, 5000)
          return () => clearInterval(intervalId); //This is important
       
    }, []  );
    return (
    <div>
    <h5>  </h5>
    <TableScrollbar rows={10}>
    <Table style={{textAlign:"center"}} striped bordered hover> 
    <thead>
    <tr>
    <th>Notifications</th>
    </tr>
    </thead>
    <tbody>
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
    </TableScrollbar>
    </div>
);
}

export default Notifiactions