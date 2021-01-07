import React , {useState, useEffect} from 'react'
import {Container,Alert, Button, Form, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap'
import useToken from '../general/useToken';
import axios from 'axios';
import Loading from 'react-loading';



function HODEditCourse(){
    const token = useToken().token

    const [options1,setOptions1]= useState([]);// Load Course Dropdown
    const [options2,setOptions2]= useState([]);// Load Instructor Dropdown
    const [loading1, setLoading1] = useState(true); //for course dropdown
    const [loading2, setLoading2] = useState(true); //for instructor
    const [loading3, setLoading3] = useState(false); //for alert
    const [alertext,setAlertext]= useState();
    const [value1,setValue1]= useState(''); // This is the course
    const [value2,setValue2]= useState(''); // This is the instructorId
    const [value3,setValue3]= useState(''); // This is the instructorName
    useEffect(()=>{
        //GET THE Courses under department
        axios.get('http://localhost:5000/api/hod/courses',{headers:{'auth-token':token}}).then((res)=>{
            let items = []
            res.data.map(course => {items.push({ courseName:course.courseName})})
            setLoading1(false)
            setOptions1(items);
        }).catch(err=>console.log(err.response.data))

        //GET THE Instructors under department
        axios.get('http://localhost:5000/api/hod/staff',{headers:{'auth-token':token}}).then((res)=>{
            let items = []
            res.data.map(staffMem => 
            {
            if((staffMem.subType==='head of department')||(staffMem.subType==='instructor')){
                items.push({instrId:staffMem.userCode, name:staffMem.name})
            }
            })
            setLoading2(false)
            setOptions2(items);
        }).catch(err=>console.log(err.response.data))

        }, []  )

    const assignInstrReq= async ()=> {
        if(value1&&value2){
            setLoading3(true)
            await axios.post('http://localhost:5000/api/hod/assign-instr-course',{courseName:value1,instructorId: value2},{headers:{'auth-token':token}}).then((res)=>{
                setLoading3(false);
                setAlertext(res.data);         
            }).catch(err=>{
                setLoading3(false);
                setAlertext(err.response.data)})
        }
        else{
            setAlertext("Either an Instructor or a course was not chosen.")
        }
    }
    const deleteInstrReq=async  () => {
        if(value1&&value2){
            setLoading3(true)
            await axios.post('http://localhost:5000/api/hod/del-instr-course',{courseName:value1,instructorId: value2},{headers:{'auth-token':token}}).then((res)=>{
            setLoading3(false);    
            setAlertext(res.data);      
            }).catch(err=>{
                setLoading3(false);
                setAlertext(err.response.data)})
        }
        else{
            setAlertext("Either an Instructor or a course was not chosen.")
        }
    }
    const updateInstrReq= async () => {
        if(value1&&value2){
            setLoading3(true)
            await axios.post('http://localhost:5000/api/hod/update-instr-course',{courseName:value1,instructorId: value2},{headers:{'auth-token':token}}).then((res)=>{
            setLoading3(false);
            setAlertext(res.data);       
            }).catch(err=>{
                setLoading3(false);
                setAlertext(err.response.data)})
        }
        else{
            setAlertext("Either an Instructor or a course was not chosen.")
        }
    }



    const handleSelect1=(e)=>{
      setValue1(e)
    }
    const handleSelect2=(e)=>{
        let thi = JSON.parse(e);
        setValue2(thi.id)
        setValue3(thi.name)
      }

    const renderTooltip1 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        The chosen <strong> instructor </strong> will be <strong> assigned</strong>  to the chosen <strong> course</strong>.
    </Tooltip>
    );
    const renderTooltip2 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        The chosen <strong> instructor</strong>  will <strong> overwrite</strong>  all other instructors for the chosen <strong> course</strong>.
    </Tooltip>
    );
    const renderTooltip3 = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        The chosen <strong> instructor</strong>  will be <strong> un-assigned </strong> from the chosen <strong> course</strong>.
    </Tooltip>
    );
    return (
    <Container fluid>
        <Form>
            <Form.Group controlId="formCourse">
                <Form.Label>Course:</Form.Label>
                <DropdownButton variant="warning" onSelect={handleSelect1} id="dropdown-basic-button" title={(value1==="")?"Select Course":value1}>
                {
                    (!loading1)?
                    (
                        options1.map(option => {
                        return <Dropdown.Item eventKey={option.courseName}>{option.courseName}</Dropdown.Item>
                        }
                        )
                    ):
                    ( 
                        <div align='center'>
                        <Loading type={"bars"} color="#333" height={'20%'} width={'20%'} />
                        </div>
                    )
                 }
                </DropdownButton>
            </Form.Group>

            <Form.Group controlId="formInstructor">
                <Form.Label>Instructor:</Form.Label>
                <DropdownButton variant="warning" onSelect={handleSelect2} id="dropdown-basic-button" title={(value3==="")?"Select Instructor":value3}>
                {  
                (!loading2)?(
                    options2.map(option => {
                        let opt = JSON.stringify({'id': option.instrId, 'name': option.name })
                        return <Dropdown.Item eventKey={opt}>{option.name}</Dropdown.Item>
                }
                )):
                ( 
                    <div align='center'>
                    <Loading type={"bars"} color="#333" height={'20%'} width={'20%'} />
                    </div>
                )}
                </DropdownButton>
            </Form.Group>

            
            {(!loading3)?
                (
                (alertext)?(<Alert variant ='warning'>{alertext}</Alert>):(<div></div>))
                :
                ( 
                    <div align='left'>
                    <Loading type={"bars"} color="#333" height={'5%'} width={'5%'} />
                    </div>
                )}
            <div style = {{paddingTop: 20}}>
                <hr  style={{
                    color: '#0C0A3E',
                    backgroundColor: '#0C0A3E',
                    height: 1,
                    borderColor : '#0C0A3E'
                }}/>
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip1}
                >
                    <Button variant="success" onClick={assignInstrReq} >Assign </Button>
                </OverlayTrigger>
                                
                {' '}
                    <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip2}
                >
                    <Button variant="info" onClick={updateInstrReq} >Update </Button>
                </OverlayTrigger>
                
                {' '}
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip3}
                >
                    <Button variant="danger" onClick={deleteInstrReq} >Delete </Button>
                </OverlayTrigger>
            </div>
        </Form>
    </Container>
    )
}

export default HODEditCourse
