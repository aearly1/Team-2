import React, {Fragment} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navi from './components/layout/Navigationbar';
import Home from './components/pages/general/Home';
import About from './components/pages/general/About';
import Login from './components/pages/general/Login';
import AcademicSchedule from './components/pages/AliPages/academicSchedule'
import SlotsPage from './components/pages/AliPages/slots'
import NotFound from './components/pages/general/NotFound';
import Sidebar from './components/layout/Sidebar';
import HODEditCourse from './components/pages/DiabPages/HODAssignInstr';
import {Container} from 'react-bootstrap';
import PropTypes from 'prop-types';

function App (props ){
  let style1 = {paddingLeft: 180, paddingTop:90}
  let style2 = {paddingTop: 90}
  return (
    <Router>
     <Fragment>
       <Navi/>
       {
        props.isLoggedIn?(
        <>
        <Sidebar/>
        <Container fluid style= {style1}>
          <Switch>
            <Route exact path = '/' component = {Home} />
            <Route exact path = '/assign-instr' component = {HODEditCourse} />
            <Route exact path = '/schedule' component = {AcademicSchedule} />
            <Route exact path = '/manageSlots' component = {SlotsPage} />
            <Route exact path = '/about' component = {About} />
            <Route exact path = '/login' component = {Login} />
            <Route component= {NotFound}/>
          </Switch>
        </Container>
        </>  
        )
        :
        (
        <Container fluid style={style2}>
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
