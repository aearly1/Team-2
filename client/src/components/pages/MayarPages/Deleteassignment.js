import React , {useEffect, useState} from 'react'
import useToken from 'client/src/components/pages/general/useToken'
import axios from 'axios'
import { DropdownButton, Dropdown, Button} from 'react-bootstrap'
import { usePromiseTracker,trackPromise } from "react-promise-tracker";

//slot page component
function DeleteAssignment()
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


//view slot assignment of this course  selected 
const  assignedslots=(e)=>{
    setLoading2(true)
    setValue2(e)
    console.log(value2)
    async function assignedslots2(){
     let url ='https://localhost:5000/api/instructor/assignedslots'+'/'+e
     await axios.get(url,{headers:{'auth-token':token}}).then((res)=>{
     let items=[]
     res.data.map(assignedslots=>{items.push(assignedslots)})
     setLoading2(false);  
     setarr(items);
 }).catch(err=>alert(err.toString()))
 
  }assignedslots2();}



const [slotselect,setslotselect]= useState("Select Slot: ");
const [selectcourse,setselectcourse]= useState("Select Course: ");

//pass the selected courses to get assigned slots and staff
        const handleSelect= async (e)=>{
            setselectcourse(e);
            assignedslots(e);
          }
          
//selected slot to be assigned updated
    const handleSelect3=(e)=>{
      setslotselect(e)
    }

  /*                                   //MAPING DROPDOWNS
    //courses
    const items1= courses.map(elem=>
      {
          return <Dropdown.Item eventKey={elem}>{elem}</Dropdown.Item>
      })

    //assigned slots 
     const items3= arr.map(elem=>
            {
                return <Dropdown.Item  eventKey={elem}>{elem}</Dropdown.Item>
            })
*/

    //Delete Assign button
     const DeleteClick=()=>{
        async function deleteassig()
            {  let URL='https://localhost:5000/api/instructor/delete-assign'+'/'+selectcourse
                await axios.post(URL,{slotID:slotselect},{headers:{'auth-token':token}}).then((res)=>{       
                }).catch(err=>alert(err)); 
             }    
               deleteassig();
            }

    //FRONT-END 
    return (<div>
        <h1>Delete assigned Slot</h1>
        <br></br>
            <div>
            <p>Courses</p>
            <DropdownButton onSelect={handleSelect} onChange={(e)=>{staff(e);console.log("ss")}} id="dropdown-basic-button" variant="warning"  drop={"down"} title={selectcourse}>
                {courses.map(elem=>
      {
          return <Dropdown.Item eventKey={elem}>{elem}</Dropdown.Item>
      })}
            </DropdownButton>
            <br></br>
            <p>assignedslots</p>
            <DropdownButton onSelect={handleSelect3} id="dropdown-basic-button" variant="warning"  drop={"down"} title={slotselect}>
                {arr.map(elem=>
            {
                return <Dropdown.Item  eventKey={elem}>{elem}</Dropdown.Item>
            })}
            </DropdownButton>
            <br></br>
            <Button onClick={DeleteClick} variant="success">Delete AssignSlot</Button>
            </div>
        
        </div>);
}

export default DeleteAssignment;