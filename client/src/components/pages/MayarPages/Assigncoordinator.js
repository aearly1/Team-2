import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import { DropdownButton, Dropdown, Button} from 'react-bootstrap'
import { usePromiseTracker,trackPromise } from "react-promise-tracker";

function Assigncoordinator()
{
    const token = useToken().token
    const [members,setMembers]= useState([]);
    const [value2,setValue2]= useState('');
    const [loading1,setLoading1]= useState(false);
    const [value1,setValue1]= useState('');
    const [loading2,setLoading2]= useState(false);
    var[courses, setcourses]= useState([]);
    var [arr,setarr]= useState([]);

    useEffect( ()=>{
        
        //get courses of instructor
            trackPromise(axios.get('https://localhost:5000/api/instructor/courses',
            {headers:{'auth-token':token}}).then((res)=>{
            let courseslist = []
            console.log(res.data.courseName)
            console.log(token)
            res.data.map(course => {courseslist.push(course.courseName)})
            setcourses(courseslist);
        }).catch(err=>alert(err)))

        }, []  )


           
//staff of  selected course
const staff= async (e)=>{
    setLoading1(true)
    setValue1(e)
            let url ='https://localhost:5000/api/instructor/view-staff-course/'+ value1
            await axios.get(url,{headers:{'auth-token': `${token}`}}).then((res)=>{ 
            console.log(res.data)
            setLoading1(false)
            let a1=[]
            res.data.map(staffmem=>{
                a1.push(staffmem.name+" "+staffmem.userCode)
           });
            setMembers(a1)
            }).catch(err=>console.log(err.response.data))
            }

        const [academicid,setacademicid]= useState("Select Academic: ");
        const [selectcourse,setselectcourse]= useState("Select Course: ");

//pass the selected courses to get unassigned slots and staff
        const handleSelect= async (e)=>{
            setselectcourse(e);
            staff(e);
          }
          
//selected academic to be assigned
    const handleSelect2=(e)=>{
     let ehelper= e.split(" ")
     let ecurrent =ehelper.pop()
      setacademicid(ecurrent)
    }

  /*                                   //MAPING DROPDOWNS
    //courses
    const items1= courses.map(elem=>
      {
          return <Dropdown.Item eventKey={elem}>{elem}</Dropdown.Item>
      })

      //academic members
      const items2= members.map(elem=>
        {
            return <Dropdown.Item  eventKey={elem}>{elem}</Dropdown.Item>
        })
*/

    //aAssign button
     const Assignclick=()=>{
        async function coordinatorset()
            {  let URL='https://localhost:5000/api/instructor/assign-academic'+'/'+selectcourse
                await axios.post(URL,{academicID:academicid},{headers:{'auth-token':token}}).then((res)=>{       
                }).catch(err=>alert(err)); 
             }     coordinatorset();}

    //FRONT-END 
    return (<div>
        <h1>Assign academic coordinator</h1>
        <br></br>
            <div>
            <p>Courses</p>
            <DropdownButton onSelect={handleSelect} onChange={(e)=>{staff(e);console.log("ss")}} id="dropdown-basic-button" variant="warning"  drop={"down"} title={selectcourse}>
                {courses.map(elem=>
      {
          return <Dropdown.Item eventKey={elem}>{elem}</Dropdown.Item>
      })
}
            </DropdownButton>
            <br></br>
            <p>Academic members</p>
            <DropdownButton onSelect={handleSelect2} id="dropdown-basic-button" variant="warning"  drop={"down"} title={academicid}>
                {members.map(elem=>
        {
            return <Dropdown.Item  eventKey={elem}>{elem}</Dropdown.Item>
        })}
            </DropdownButton>
            <br></br>
            <Button onClick={Assignclick} variant="success">Remove academic</Button>
            </div>
        
        </div>);
}

export default Assigncoordinator;