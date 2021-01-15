import React, {Fragment,useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Redirect, Route, Switch,useHistory } from 'react-router-dom';
import axios from 'axios'

import {HODData} from './components/layout/data/HODData'
import {HRData} from './components/layout/data/HRData'
import {InstrData} from './components/layout/data/InstrData'
import {TAData} from './components/layout/data/TAData'
import {CoordData} from './components/layout/data/CoordData'

import About from './components/pages/general/About';
import Login from './components/pages/general/Login';
import AcademicSchedule from './components/pages/AliPages/SchedulesPage/academicSchedule'
import SlotsPage from './components/pages/AliPages/ManageSlotsPage/MainPage'
import Requests from './components/pages/AliPages/RequestPage/Main'
import NotFound from './components/pages/general/NotFound';
import Sidebar from './components/layout/SidebarMain';
import HODEditCourse from './components/pages/DiabPages/HODAssignInstr';
import HODViewStaff from './components/pages/DiabPages/HODViewStaff';
import HODCourseStaff from './components/pages/DiabPages/HODCourseStaff';
import HODStaffDO from './components/pages/DiabPages/HODStaffDO';
import HODStaffDOS from './components/pages/DiabPages/HODStaffDOS';
import HODCourseCov from './components/pages/DiabPages/HODCourseCov';
import ViewStaffProps from './components/pages/SaeedPages/ViewStaffProps';
import ModifySalary from './components/pages/SaeedPages/ModifySalary';
import AddMissingAttendance from './components/pages/SaeedPages/AddMissingAttendance';
import AddLocation from './components/pages/SaeedPages/Locations/AddLocation'
import EditLocation from './components/pages/SaeedPages/Locations/EditLocation'
import DeleteLocation from './components/pages/SaeedPages/Locations/DeleteLocation'
import AddFaculty from './components/pages/SaeedPages/Faculty/AddFaculty'
import EditFaculty from './components/pages/SaeedPages/Faculty/EditFaculty'
import DeleteFaculty from './components/pages/SaeedPages/Faculty/DeleteFaculty'
import AddDepartment from './components/pages/SaeedPages/Departments/AddDepartment'
import EditDepartment from './components/pages/SaeedPages/Departments/EditDepartment'
import DeleteDepartment from './components/pages/SaeedPages/Departments/DeleteDepartment'
import AddCourse from './components/pages/SaeedPages/Courses/AddCourse'
import EditCourse from './components/pages/SaeedPages/Courses/EditCourse'
import DeleteCourse from './components/pages/SaeedPages/Courses/DeleteCourse'
import HRAddStaff from './components/pages/SaeedPages/Staff/HRAddStaff'
import HREditStaff from './components/pages/SaeedPages/Staff/HREditStaff'
import HRDeleteStaff from './components/pages/SaeedPages/Staff/HRDeleteStaff'
import HODTeachAssignments from './components/pages/DiabPages/HODTeachAssignments';
import AssignAcademicslot from './components/pages/MayarPages/AssignAcademicslot';
import Assigncoordinator from './components/pages/MayarPages/Assigncoordinator';
import Deleteassignment from './components/pages/MayarPages/Deleteassignment';
import InstructorCourseCoverage from './components/pages/MayarPages/InstructorCourseCoverage';
import Removeacademic from './components/pages/MayarPages/Removeacademic';
import Updateassignment from './components/pages/MayarPages/Updateassignment';
import Viewslotassignment from './components/pages/MayarPages/viewslotassignment';
import Viewstaffcourse from './components/pages/MayarPages/Viewstaffcourse';
import Viewstaffperinstr from './components/pages/MayarPages/Viewstaffperinstr';
import {Container} from 'react-bootstrap';
import Profile from './components/pages/SohobPages/Profile'
import Attendance from './components/pages/SohobPages/Attendance';
import useToken from './components/pages/general/useToken'
import Logout from './components/pages/general/Logout';
function App (){
  const { token, setToken } = useToken();
  const [ tokeypokey, setTokeypokey ] = useState(false);
  const [sidebardata, setSidebardata] = useState([]);

  useEffect(async ()=>{
    async function yuck(){
      await axios.get('http://localhost:5000/api/hod/sidebarData',{headers:{'auth-token':token}}).then(
        (res)=>{
          if(res.data ==='hod'){
            setSidebardata(HODData)
          }
          else if(res.data ==='ta'){
            setSidebardata(TAData)
          }
          else if(res.data ==='coordinator'){
            setSidebardata(CoordData)
          }
          else if(res.data ==='instructor'){
            setSidebardata(InstrData)
          }
          else if(res.data ==='HR'){
            setSidebardata(HRData)
          }
        }
      ).catch(err=>console.log(err.response.data))
    }
    await yuck();
    
  },[token,tokeypokey])



  const history = useHistory()
  const killtokey = ()=> setTokeypokey(false)
  let style1 = { 
    padding:0,
    paddingTop:58,
    paddingBottom:0,
    marginBottom:0,
    height: '100%'
  }
  let style2 = {paddingTop:90}
  return (
    <Router>
     <Fragment>
     <Sidebar tokey={tokeypokey} sidebardata= {sidebardata} tokenn={token}/>
       {
        token?(
        <>
        <Container fluid style= {style2}>
          <Switch>
            <Route exact path = '/' component = {Profile} />
            <Route exact path = '/course-staff'  component = {HODCourseStaff}/>
            <Route exact path = '/teach-assignments' component = {HODTeachAssignments}/>
            <Route exact path = '/staff-do'  component = {HODStaffDO}/>
            <Route exact path = '/staff-dos'    component = {HODStaffDOS}/>
            <Route exact path = '/course-cov'  component = {HODCourseCov}/>
            <Route exact path = '/assign-instr'  component = {HODEditCourse} />
            <Route exact path = '/view-staff'  component = {HODViewStaff} />
            <Route exact path = '/ViewStaffProps'  component = {ViewStaffProps} />
            <Route exact path = '/ModifySalary'   component = {ModifySalary} />
            <Route exact path = '/AddMissingAttendance' component = {AddMissingAttendance} />
            <Route exact path = '/AddLocation' component = {AddLocation}/>
            <Route exact path = '/EditLocation' component = {EditLocation}/>
            <Route exact path = '/DeleteLocation' component = {DeleteLocation}/>
            <Route exact path = '/AddFaculty'  component = {AddFaculty}/>
            <Route exact path = '/EditFaculty' component = {EditFaculty}/>
            <Route exact path = '/DeleteFaculty' component = {DeleteFaculty}/>
            <Route exact path = '/AddDepartment' component = {AddDepartment}/>
            <Route exact path = '/EditDepartment' component = {EditDepartment}/>
            <Route exact path = '/DeleteDepartment' component = {DeleteDepartment}/>
            <Route exact path = '/AddCourse' component = {AddCourse}/>
            <Route exact path = '/EditCourse' component = {EditCourse}/>
            <Route exact path = '/DeleteCourse' component = {DeleteCourse}/>
            <Route exact path = '/HRAddStaff' component = {HRAddStaff}/>
            <Route exact path = '/HREditStaff' component = {HREditStaff}/>
            <Route exact path = '/HRDeleteStaff' component = {HRDeleteStaff}/>
            <Route exact path = '/schedule' component = {AcademicSchedule} />
            <Route exact path = '/manageSlots' component = {SlotsPage} />
            <Route exact path = '/requests' component = {Requests} />
            <Route exact path = '/about' component = {About} />
            <Route exact path = '/login' component ={Profile} />
            <Route exact path = '/profile' component = {Profile} />
            <Route exact path = '/attendance' component = {Attendance} />
            <Route exact path = '/view-course-coverage' component = {InstructorCourseCoverage} />
            <Route exact path = '/view-slot-assign-course' component = {Viewslotassignment} />
            <Route exact path = '/view-staff-course' component = {Viewstaffcourse} />
            <Route exact path = '/view-staff-dep' component = {Viewstaffperinstr} />
            <Route exact path = '/assign-course' component = {AssignAcademicslot} />
            <Route exact path = '/update-assign' component = {Updateassignment} />
            <Route exact path = '/delete-assign' component = {Deleteassignment} />
            <Route exact path = '/remove-academicMember' component = {Removeacademic} />
            <Route exact path = '/assign-academic' component = {Assigncoordinator} />
            <Route exact path = '/logout' component = {() =><> <Logout setTokeypokey={killtokey} setToken={setToken}  /> {killtokey}      </>} />
            <Route component= {NotFound}/>
          </Switch>
        </Container>
        </>  
        )
        :
        (
        <div style={{height:"100vh"}}>
        <Container fluid style={style1}>
          <Switch>
            <Route exact path = '/about' component = {About} />
            <Route exact path = '/' component = {() => <Login setToken={setToken} setTokeypokey={setTokeypokey} />} />
            <Route exact path = '/login' component = {() => <Login setToken={setToken} setTokeypokey={setTokeypokey} />} />
            <Route component= {NotFound}/>
          </Switch>
        </Container>
        </div>
        ) 
       }  
        
      </Fragment>
    </Router>
  );
}
export default App;

/* <Route exact path = '/view-course-coverage' component = {InstructorCourseCoverage} />
<Route exact path = '/view-slot-assign-course' component = {Viewslotassignment} />
<Route exact path = '/view-staff-course' component = {Viewstaffcourse} />
<Route exact path = '/view-staff-dep' component = {Viewstaffperinstr} />
<Route exact path = '/assign-course' component = {AssignAcademicslot} />
<Route exact path = '/update-assign' component = {Updateassignment} />
<Route exact path = '/delete-assign' component = {Deleteassignment} />
<Route exact path = '/remove-academicMember' component = {Removeacademic} />
<Route exact path = '/assign-academic' component = {Assigncoordinator} /> */
