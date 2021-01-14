import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import {Container,Row,Col} from 'react-bootstrap'

function AcademicSchedule()
{
    const token = useToken().token

    let style1 = {borderStyle:"solid", borderWidth: 3, backgroundColor: "#F7C344"}
    let style2 = {borderStyle:"solid", borderWidth: 3}
    const arr=[["SAT","FREE","FREE","FREE","FREE","FREE"],
               ["SUN","FREE","FREE","FREE","FREE","FREE"],
               ["MON","FREE","FREE","FREE","FREE","FREE"],
               ["TUES","FREE","FREE","FREE","FREE","FREE"],
               ["WED","FREE","FREE","FREE","FREE","FREE"],
               ["THURS","FREE","FREE","FREE","FREE","FREE"],
               ["FRI","FREE","FREE","FREE","FREE","FREE"]];
    var [schedule, setSchedule] = useState(arr)
    
    useEffect(async ()=>{
        const intervalId = setInterval(() => {  
            //GET THE Courses under department
       async function doIt()
       {
           await axios.get('http://localhost:5000/api/academicMember/schedule',{headers:{'auth-token':token}}).then((res)=>{
           let items=res.data;
           var array = [...schedule];
           for (const element of items) 
           {
               const day=element.day-1;
               const slot=element.slotNr;
               array[day][slot]=element.courseTaughtInSlot + " - " + element.slotLocation + "\n" + "Replacement staff: "+ element.replacementStaff
           }
           setSchedule(array);
       }).catch(err=>alert(err))}
           doIt();
        }, 5000)
        return () => clearInterval(intervalId); //This is important
        
        }, []  )

    
    const tableRows = schedule.map((elem)=>
    {
        return (<Row>
                <Col style={style1}><br></br>{elem[0]}<br></br><br></br></Col>
                <Col style={style2}><br></br>{elem[1]}<br></br><br></br></Col>
                <Col style={style2}><br></br>{elem[2]}<br></br><br></br></Col>
                <Col style={style2}><br></br>{elem[3]}<br></br><br></br></Col>
                <Col style={style2}><br></br>{elem[4]}<br></br><br></br></Col>
                <Col style={style2}><br></br>{elem[5]}<br></br><br></br></Col>
                </Row>)
    })

    return (
    <div>
        <h1>My Weekly Schedule</h1>
        <br></br>
        <Container style={{textAlign:"center"}}>
        <Row>
            <Col style={style1}><br></br> <br></br><br></br></Col>
            <Col style={style1}><br></br>1st<br></br><br></br></Col>
            <Col style={style1}><br></br>2nd<br></br><br></br></Col>
            <Col style={style1}><br></br>3rd<br></br><br></br></Col>
            <Col style={style1}><br></br>4th<br></br><br></br></Col>
            <Col style={style1}><br></br>5th<br></br><br></br></Col>
        </Row>
        {tableRows}
        </Container>
        <br></br>
    </div>
    );
}

export default AcademicSchedule;