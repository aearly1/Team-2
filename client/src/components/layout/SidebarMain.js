import React, {useState} from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Nav, Navbar} from 'react-bootstrap';
import { Link } from "react-router-dom";
import SubMenu from './SubMenu';
import {SidebarData} from './SidebarData'


import * as FAIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'

// const Nav = styled.div`
//     background: #15171c;
//     height: 80px;
//     display: flex;
//     justify-content: flex-start;
//     align-items: center;
// `

const Navig = styled.div`
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


const NavIcon = styled(Link)`
    margin-left: 2rem;
    font-size: 2rem;
    height: 50px;
    display:flex;
    justify-content: flex-start;
    align-items: center;
`;
const SidebarNav = styled.nav`
background:  #15171c;
  width: 250px;
  height: 100vh ;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;
const SidebarWrap = styled.div`
    width:100%;
`;


function SidebarMain(props) {
    const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
    return (
        <>
        <Navig>
            <Navbar>
            <NavIcon style = {{textDecoration:"none", color: "gold"}} className ="pr-5" to='#'>
                <i  class="fas fa-bars" onClick={showSidebar} />
            </NavIcon>
            {props.isLoggedIn?(<Navbar.Brand  href="/"> Team 2 University System</Navbar.Brand> ):(<Navbar.Brand  href="/login"> Team 2 University System</Navbar.Brand>) }  
            
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav className="ml-auto">
                {props.isLoggedIn?(<Nav.Item><Nav.Link href="/profile" style = {{textDecoration:"underline", whiteSpace:"nowrap"}}><i class="fas fa-user-circle pr-1" ></i>{props.name}</Nav.Link></Nav.Item> ):(<Nav.Item className = "border border-1 border-warning mr-2" style={{borderRadius: 8}}><Nav.Link href="/login">Login</Nav.Link></Nav.Item>) }
                <Nav.Item><Nav.Link href="/about">About</Nav.Link></Nav.Item>

            </Nav>
            
            </Navbar>
        </Navig>
        <SidebarNav sidebar={sidebar} >
            <SidebarWrap>
            <NavIcon to='#'>
                <AiIcons.AiOutlineClose style={{color:"gold",marginLeft:12, marginTop: 10}} onClick= {showSidebar}/>
            </NavIcon>
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
            </SidebarWrap>
        </SidebarNav>
        </>
    )
}

SidebarMain.propTypes = {
    isLoggedIn: PropTypes.bool,
    name: PropTypes.string
  }
  
  SidebarMain.defaultProps = {
    isLoggedIn: true,
    name: "Hassan Soubra",
  };
  
export default SidebarMain
