import { useContext } from 'react';
import { Navbar, Nav } from 'rsuite';
import { AppContext } from '../context/Provider';
import { useNavigate } from 'react-router-dom';

function NavbarHome() {
    const {setPage} = useContext(AppContext);
    const navigate = useNavigate();
    return ( 
        <Navbar>
            <Nav>
                <Nav.Item onSelect={()=>setPage("popularTemplates")}>Popular templates</Nav.Item>
                <Nav.Item onSelect={()=>setPage("latestTemplates")} >Latest templates</Nav.Item>
                <Nav.Item onSelect={()=>setPage("popularTopics")}>Popular topics</Nav.Item>
            </Nav>
            <Nav pullRight>
                <Nav.Item onSelect={()=>navigate('/login')}>Login</Nav.Item>
                <Nav.Item onSelect={()=>navigate('/register')} >Register</Nav.Item>
            </Nav>
        </Navbar>
    );
}

export default NavbarHome;