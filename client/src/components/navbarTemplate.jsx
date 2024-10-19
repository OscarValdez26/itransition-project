import { useContext, useState } from 'react';
import { Navbar, Nav } from 'rsuite';
import { AppContext } from '../context/Provider.jsx';

function NavbarTemplate({includeForms}) {
    const { user, setPage } = useContext(AppContext);
    const [showForms,setShowForms] = useState(includeForms);
    return ( 
        <Navbar>
            <Nav>
                <Nav.Item>Welcome {user.name}</Nav.Item>
                <Nav.Item onSelect={()=>setPage("configuration")} >Configuration</Nav.Item>
                <Nav.Item onSelect={()=>setPage("questions")}>Questions</Nav.Item>
                {showForms && <Nav.Item onSelect={()=>setPage("forms")}>Forms</Nav.Item>}
            </Nav>
        </Navbar>
    );
}

export default NavbarTemplate;