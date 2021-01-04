import React from 'react';
import { Nav, Navbar} from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Styles = styled.div`
  .navbar { background-color: #0C0A3E ;
    position: fixed;
    width: 100%;
    z-index: 1; 
  }
  a, .navbar-nav, .navbar-light .nav-link {
    color: #fff;
    &:hover { color: white; }
  }
  .navbar-brand {
    font-size: 1.4em;
    color: #fff;
    &:hover { color: white; }
  }
  .form-center {
    position: absolute !important;
    left: 25%;
    right: 25%;
  }
`;
 //Currently
function NavigationBar (props) {
  return(
  <Styles>
    <Navbar>
      {props.isLoggedIn?(<Navbar.Brand href="/"> Team 2 University System</Navbar.Brand> ):(<Navbar.Brand href="/login"> Team 2 University System</Navbar.Brand>) }  
      
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Nav className="ml-auto">
        {props.isLoggedIn?(<Nav.Item><Nav.Link href="/" style = {{textDecoration:"underline"}}>{props.name}</Nav.Link></Nav.Item> ):(<Nav.Item className = "border border-1 border-warning mr-2" style={{borderRadius: 8}}><Nav.Link href="/login">Login</Nav.Link></Nav.Item>) }
        <Nav.Item>
        <Navbar.Brand href="/profile">
        <i class="fas fa-user-circle"></i>
        </Navbar.Brand>
        </Nav.Item>
        <Nav.Item>
        <Nav.Link href="/about">About</Nav.Link></Nav.Item>

      </Nav>
      
    </Navbar>
  </Styles>
  )
}
NavigationBar.propTypes = {
  isLoggedIn: PropTypes.bool,
  name: PropTypes.string
}

NavigationBar.defaultProps = {
  isLoggedIn: true,
  name: "Hassan Soubra",
};

export default NavigationBar