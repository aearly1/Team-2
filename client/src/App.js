import React, {Fragment} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navi from './components/layout/Navigationbar';
import Home from './components/pages/general/Home';
import About from './components/pages/general/About';
import Login from './components/pages/general/Login';
import Ali from './components/pages/AliPages/Ali'
import Sidebar from './components/layout/Sidebar';
import HODEditCourse from './components/pages/DiabPages/HODAssignInstr';
import {Container} from 'react-bootstrap';
const App =() => {
  return (
    <Router>
     <Fragment>
       <Navi/>
       <Sidebar />
        <Container fluid style= {{paddingLeft: 180 , paddingTop:90}}>
          <Switch>
            <Route exact path = '/' component = {Home} />
            <Route exact path = '/assign-instr' component = {HODEditCourse} />
            <Route exact path = '/about' component = {About} />
            <Route exact path = '/login' component = {Login} />
          </Switch>
        </Container>
      </Fragment>
    </Router>
  );
}

export default App;
