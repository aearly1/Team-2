import React from 'react'
import {Table,Container,Row,Col} from 'react-bootstrap'

function AcademicSchedule()
{
    let style1 = {borderStyle:"solid", borderWidth: 3, backgroundColor: "#F7C344"}
    let style2 = {borderStyle:"solid", borderWidth: 3}

    const arr=[["SAT","CSEN703 - C3. 201","CSEN703 - C3. 201","FREE","CSEN703 - C3. 102","FREE"],
               ["SUN","FREE","FREE","FREE","FREE","FREE"],
               ["MON","FREE","FREE","FREE","FREE","FREE"],
               ["TUES","FREE","CSEN703 - C3. 201","FREE","CSEN703 - C3. 102","FREE"],
               ["WED","CSEN703 - C3. 201","CSEN703 - C3. 201","FREE","FREE","FREE"],
               ["THURS","CSEN703 - C3. 201","CSEN703 - C3. 201","FREE","CSEN703 - C3. 102","FREE"],
               ["FRI","FREE","FREE","FREE","FREE","FREE"]];

    const tableRows = arr.map((elem)=>
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