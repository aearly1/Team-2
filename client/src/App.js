import React, {Fragment} from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navi from './components/layout/Navigationbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Sidebar from './components/layout/Sidebar';

const App =() => {
  return (
    <Router>
     <Fragment>
       <Navi/>
       <Sidebar />
        <div className="container">
          <Switch>
            <Route exact path = '/' component = {Home} />
            <Route exact path = '/about' component = {About} />
            
          </Switch>
        </div>
      </Fragment>
    </Router>
  );
}

export default App;
