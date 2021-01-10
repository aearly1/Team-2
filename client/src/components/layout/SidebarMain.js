import React, {useState,useEffect} from 'react'
import styled from 'styled-components';
import { Nav, Navbar} from 'react-bootstrap';
import { Link } from "react-router-dom";
import SubMenu from './SubMenu';
import axios from 'axios'
import * as AiIcons from 'react-icons/ai'
import * as FaIcons from 'react-icons/fa'
import * as GoIcons from 'react-icons/go'
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


function SidebarMain({tokey ,sidebardata,tokenn}) {
  const [sidebar, setSidebar] = useState(false);
  const [vari, setVari] = useState(0);

  const showSidebar = () => setSidebar(!sidebar);
    return (
        <>
        <Navig>
            <Navbar>
            {(tokey||tokenn)?(<NavIcon style = {{textDecoration:"none", color: "gold"}} className ="pr-5" to='#'>
                <i  class="fas fa-bars" onClick={showSidebar} />
            </NavIcon>):(<div></div>)}
            <Navbar.Brand  href="/"> Team 2 University System</Navbar.Brand> 
            
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav className="ml-auto">
            {(tokey||tokenn)?
                (<>
               
                <Nav.Item >
                <Nav.Link href="/logout" style = {{textDecoration:"underline",textDecorationColor:"purple", whiteSpace:"nowrap"}}
                >
                <GoIcons.GoSignOut/>
                Log out
                </Nav.Link>
                </Nav.Item>
                
                <Nav.Item><Nav.Link href="/profile" style = {{textDecoration:"underline",textDecorationColor:"gold", whiteSpace:"nowrap"}}>
                <FaIcons.FaUserCircle />
                Profile
                </Nav.Link>
                </Nav.Item>
                </> 
                
                )
                :
                (
                <Nav.Item className = "border border-1 border-warning mr-2" style={{borderRadius: 8}}>
                <Nav.Link href="/login"
                >Login
                </Nav.Link>
                </Nav.Item>
                 ) 
                }
                <Nav.Item><Nav.Link href="/about" style = {{textDecoration:"underline",textDecorationColor:"gold", whiteSpace:"nowrap"}}>
                <FaIcons.FaInfoCircle/>
                About
                </Nav.Link></Nav.Item>
            </Nav>
            
            </Navbar>
        </Navig>
        {(tokey||tokenn)?(
        <SidebarNav sidebar={sidebar} >
            <SidebarWrap>
            
            <NavIcon to='#'>
                <AiIcons.AiOutlineClose style={{color:"gold",marginLeft:12, marginTop: 10}} onClick= {showSidebar}/>
            </NavIcon>
            { (sidebardata)?(
            sidebardata.map(
              (item, index) => {
                return <SubMenu item={item} key={index} />;
            }
            ))
            :(<></>)
            }
            </SidebarWrap>
            </SidebarNav>
            )
            :
            (
              <></>
            )
            }
            
        </>
    )
}
export default SidebarMain
