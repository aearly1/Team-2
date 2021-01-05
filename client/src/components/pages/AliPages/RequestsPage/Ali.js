import React , {useState} from "react"
import {OverlayTrigger,Tooltip, Container, Col, Row, DropdownButton, Dropdown,Modal, Button, Table} from 'react-bootstrap'

function Trial()
{
    const  [text,setText]=useState("pending")
    return(
        <div>
            <h1>{text}</h1>
            <Button onClick={()=>text=="pending"?setText("rejected"):setText("pending")} variant="primary">Primary</Button>{' '}
        </div>

    )
}
export default Trial;