import { useContext, useState } from 'react';
import { Navbar, Nav, Button } from 'rsuite';
import { AppContext } from '../context/Provider';

function NavigationBar({updateTemplate,setOpenModal,includeForms}) {
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
            <Nav pullRight>
                <Nav.Item><Button color="green" appearance="primary" onClick={updateTemplate}>Save Template</Button></Nav.Item>
                {showForms && <Nav.Item><Button color="red" appearance="primary" onClick={() => setOpenModal(true)}>Delete Template</Button></Nav.Item>}
            </Nav>
        </Navbar>
    );
}

export default NavigationBar;