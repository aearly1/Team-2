import React from 'react';
import { Nav, Navbar} from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
  .navbar { background-color: #0C0A3E }
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

const NavigationBar = () => (
  <Styles>
    <Navbar>
      <Navbar.Brand href="/"> Team 2 University System</Navbar.Brand>
      
       <Nav className="ml-auto">
       <Nav.Item className = "border border-1 border-warning mr-2" style={{borderRadius: 8}}><Nav.Link href="/login">Login</Nav.Link></Nav.Item> 
          <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item> 
          <Nav.Item><Nav.Link href="/about">About</Nav.Link></Nav.Item>
        </Nav>
      
    </Navbar>
  </Styles>
)
export default NavigationBar