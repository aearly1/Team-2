import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import { DropdownButton, Dropdown, Button} from 'react-bootstrap'

function UpdateAssignment()
{
    const token = useToken().token
    const [members,setMembers]= useState([]);
    const [value2,setValue2]= useState('');
    const [loading1,setLoading1]= useState(false);
    const [value1,setValue1]= useState('');
    const [loading2,setLoading2]= useState(false);
    var[courses, setcourses]= useState([]);
    var [arr,setarr]= useState([]);

    useEffect(async ()=>{
        async function doIt()
        { //get courses of instructor
            await axios.get('http://localhost:5000/api/instructor/courses',{headers:{'auth-token':token}}).then((res)=>{
            let courseslist = []
            res.data.map(course => {courseslist.push({ courseName:course.courseName})})
            setcourses(courseslist);
        }).catch(err=>alert(err))}
            await doIt();
        }, []  )


//view slot assignment of this course  selected 
const  assignedslots=(e)=>{
    setLoading2(true)
    setValue2(e)
    async function assignedslots2(){
     let url ='http://localhost:5000/api/instructor/assignedslots'+'/'+value2
     await axios.get(url,{headers:{'auth-token':token}}).then((res)=>{
     let items=[]
     res.data.map(assignedslots=>{items.push(assignedslots.slotID)})
     setLoading2(false);  
     setarr(items);
 }).catch(err=>setarr(err.toString()))
 assignedslots2();
  }}

           
//staff of  selected course
const staff=(e)=>{
    setLoading1(true)
    setValue1(e)
    async function staff2 (){
            let url ='http://localhost:5000/api/instructor/view-staff-course/ '+'/'+ value1
            await axios.post(url,{headers:{'auth-token':token}}).then((res)=>{ 
            setLoading1(false)
            let members=[]
            res.data.map(staffmem=>{
                members.push(staffmem.name+" "+staffmem.id)
           });
            setMembers(members)
            }).catch(err=>console.log(err.response.data))
            staff2();
}}

const [slotselect,setslotselect]= useState([]);
const [academicid,setacademicid]= useState([]);
const [selectcourse,setselectcourse]= useState([]);

//pass the selected courses to get assigned slots and staff
        const handleSelect= async (e)=>{
            setselectcourse(e);
            assignedslots(e);
            staff(e);
          }
          
//selected academic to be assigned updated
    const handleSelect2=(e)=>{
        let ehelper= e.split(" ")
        let ecurrent =ehelper.pop()
         setacademicid(ecurrent)    }

//selected slot to be assigned updated
    const handleSelect3=(e)=>{
      setslotselect(e)
    }

                                     //MAPING DROPDOWNS
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

    //assigned slots 
     const items3= arr.map(elem=>
            {
                return <Dropdown.Item  eventKey={elem}>{elem}</Dropdown.Item>
            })

    //Update Assign button
     const AssignClick=()=>{
        async function updateslot()
            {  let URL='http://localhost:5000/api/instructor/update-assign'+'/'+selectcourse
                await axios.post(URL,{slotID:slotselect, academicId:academicid },{headers:{'auth-token':token}}).then((res)=>{       
                }).catch(err=>alert(err)); 
             }    
                updateslot();
            }

    //FRONT-END 
    return (<div>
        <h1>Update assigned Slot</h1>
        <br></br>
            <div>
            <p>Courses</p>
            <DropdownButton onSelect={handleSelect} id="dropdown-basic-button" variant="warning"  drop={"down"} title={selectcourse}>
                {items1}
            </DropdownButton>
            <br></br>
            <p>Academic members</p>
            <DropdownButton onSelect={handleSelect2} id="dropdown-basic-button" variant="warning"  drop={"down"} title={academicid}>
                {items2}
            </DropdownButton>
            <br></br>
            <p>assignedslots</p>
            <DropdownButton onSelect={handleSelect3} id="dropdown-basic-button" variant="warning"  drop={"down"} title={slotselect}>
                {items3}
            </DropdownButton>
            <br></br>
            <Button onClick={AssignClick} variant="success">Update AssignSlot</Button>
            </div>
        
        </div>);
}

export default UpdateAssignment;