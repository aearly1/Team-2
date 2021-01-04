import React from 'react'
import {Container,Row,Col} from 'react-bootstrap'

function AcademicSchedule()
{
    let style1 = {borderStyle:"solid", borderWidth: 3, backgroundColor: "#F7C344"}
    let style2 = {borderStyle:"solid", borderWidth: 3}
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
        <Row>
            <Col style={style1}><br></br>SAT<br></br><br></br></Col>
            <Col style={style2}><br></br>CSEN703 - C3. 201<br></br><br></br></Col>
            <Col style={style2}><br></br>CSEN703 - C3. 201<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>CSEN703 - C3. 102<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
        </Row>
        <Row>
            <Col style={style1}><br></br>SUN<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
        </Row>
        <Row>
            <Col style={style1}><br></br>MON<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
        </Row>
        <Row>
            <Col style={style1}><br></br>TUES<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>CSEN703 - C3. 201<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>CSEN703 - C3. 102<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
        </Row>
        <Row>
            <Col style={style1}><br></br>WED<br></br><br></br></Col>
            <Col style={style2}><br></br>CSEN703 - C3. 201<br></br><br></br></Col>
            <Col style={style2}><br></br>CSEN703 - C3. 201<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
        </Row>
        <Row>
            <Col style={style1}><br></br>THURS<br></br><br></br></Col>
            <Col style={style2}><br></br>CSEN703 - C3. 201<br></br><br></br></Col>
            <Col style={style2}><br></br>CSEN703 - C3. 201<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>CSEN703 - C3. 102<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
        </Row>
        <Row>
            <Col style={style1}><br></br>FRI<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
            <Col style={style2}><br></br>FREE<br></br><br></br></Col>
        </Row>
        </Container>
        <br></br>
    </div>
    );
}

export default AcademicSchedule;