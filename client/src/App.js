import React, {Fragment} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './components/pages/general/Home';
import About from './components/pages/general/About';
import Login from './components/pages/general/Login';
import AcademicSchedule from './components/pages/AliPages/SchedulesPage/academicSchedule'
import SlotsPage from './components/pages/AliPages/ManageSlotsPage/MainPage'
import trial from './components/pages/AliPages/RequestsPage/Ali'
import Requests from './components/pages/AliPages/RequestsPage/MainPage'
import NotFound from './components/pages/general/NotFound';
import Sidebar from './components/layout/SidebarMain';
import HODEditCourse from './components/pages/DiabPages/HODAssignInstr';
import HODViewStaff from './components/pages/DiabPages/HODViewStaff';
import HODCourseStaff from './components/pages/DiabPages/HODCourseStaff';
import HODStaffDO from './components/pages/DiabPages/HODStaffDO';
import HODStaffDOS from './components/pages/DiabPages/HODStaffDOS';
import HODCourseCov from './components/pages/DiabPages/HODCourseCov';
import {Container} from 'react-bootstrap';
import Profile from './components/pages/SohobPages/Profile'
import PropTypes from 'prop-types';
import Attendance from './components/pages/SohobPages/Attendance';

function App (props ){
  let style1 = { paddingTop:90}
  return (
    <Router>
     <Fragment>
       {
        props.isLoggedIn?(
        <>
        <Sidebar/>
        <Container fluid style= {style1}>
          <Switch>
            <Route exact path = '/' component = {Home} />
            <Route exact path = '/course-staff' component = {HODCourseStaff}/>
            <Route exact path = '/staff-do' component = {HODStaffDO}/>
            <Route exact path = '/staff-dos' component = {HODStaffDOS}/>
            <Route exact path = '/course-cov' component = {HODCourseCov}/>
            <Route exact path = '/trial' component = {trial}/>
            <Route exact path = '/assign-instr' component = {HODEditCourse} />
            <Route exact path = '/view-staff' component = {HODViewStaff} />
            <Route exact path = '/schedule' component = {AcademicSchedule} />
            <Route exact path = '/manageSlots' component = {SlotsPage} />
            <Route exact path = '/requests' component = {Requests} />
            <Route exact path = '/about' component = {About} />
            <Route exact path = '/login' component = {Login} />
            <Route exact path = '/profile' component = {Profile} />
            <Route exact path = '/attendance' component = {Attendance} />
            <Route component= {NotFound}/>
          </Switch>
        </Container>
        </>  
        )
        :
        (
        <Container fluid style={style1}>
          <Switch>
            <Route exact path = '/about' component = {About} />
            <Route exact path = '/' component = {Login} />
            <Route exact path = '/login' component = {Login} />
            <Route component= {NotFound}/>
          </Switch>
        </Container>
        ) 
       }  
        
      </Fragment>
    </Router>
  );
}

App.propTypes = {
  isLoggedIn: PropTypes.bool
}

App.defaultProps = {
  isLoggedIn: true
};


export default App;
