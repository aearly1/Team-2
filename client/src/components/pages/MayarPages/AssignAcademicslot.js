import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import { DropdownButton, Dropdown, Button} from 'react-bootstrap'

function AssignSlot()
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


//unassigned slots of selected course
const  unassignedslots=(e)=>{
    async function unassignedslots2(){
    setLoading2(true)
    setValue2(e)
     let url ='http://localhost:5000/api/instructor/unassigned'+'/'+e
     await axios.get(url,{headers:{'auth-token':token}}).then((res)=>{
     let items=[]
     res.data.map(unassignedslot=>{items.push(unassignedslot.slotID)})
     setLoading2(false);  
     setarr(items);
 }).catch(err=>setarr(err.toString()))
    unassignedslots2();
  }}

           
//staff of  selected course
const  staff=(e)=>
    async function staff2 (){
    setLoading1(true)
            setValue1(e)
            let url ='http://localhost:5000/api/instructor/view-staff-course/ '+'/'+ e
            await axios.post(url,{headers:{'auth-token':token}}).then((res)=>{ 
            setLoading1(false)
            let members=[]
            res.data.map(staffmem=>{
                members.push(staffmem.name+" "+staffmem.id)
           });
            setMembers(members)
            }).catch(err=>console.log(err.response.data))
            staff2();
}

const [slotselect,setslotselect]= useState([]);
const [academicid,setacademicid]= useState([]);
const [selectcourse,setselectcourse]= useState([]);

//pass the selected courses to get unassigned slots and staff
        const handleSelect= async (e)=>{
            setselectcourse(e);
            unassignedslots(e);
            staff(e);
          }
          
//selected academic to be assigned
    const handleSelect2=(e)=>{
     let ehelper= e.split(" ")
     let ecurrent =ehelper.pop()
      setacademicid(ecurrent)
    }
//selected slot to be assigned
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

    //unassigned slots 
     const items3= arr.map(elem=>
            {
                return <Dropdown.Item  eventKey={elem}>{elem}</Dropdown.Item>
            })

    //aAssign button
     const AssignClick=()=>{
        async function assignslot()
            {  let URL='http://localhost:5000/api/instructor/assign-course'+'/'+selectcourse
                await axios.post(URL,{slotID:slotselect, academicId:academicid },{headers:{'auth-token':token}}).then((res)=>{       
                }).catch(err=>alert(err)); 
             }    
                assignslot();
            }

    //FRONT-END 
    return (<div>
        <h1>Assign Unassigned Slot</h1>
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
            <p>Unassignedslots</p>
            <DropdownButton onSelect={handleSelect3} id="dropdown-basic-button" variant="warning"  drop={"down"} title={slotselect}>
                {items3}
            </DropdownButton>
            <br></br>
            <Button onClick={AssignClick} variant="success">AssignSlot</Button>
            </div>
        
        </div>);
}

export default AssignSlot;