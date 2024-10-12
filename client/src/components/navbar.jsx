import { useContext } from 'react';
import { Navbar, Nav } from 'rsuite';
import { AppContext } from '../context/Provider';
import { getRequest } from '../api/api';
import { useNavigate } from 'react-router-dom';
import ExitIcon from '@rsuite/icons/Exit';

function NavigationBar() {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    const logout = async () => {
        const result = await getRequest('/logout');
        if(result === "Logout OK") {
            // localStorage.removeItem("userId");
            // localStorage.removeItem("userName");
            // localStorage.removeItem("userEmail");
            //localStorage.clear();
            navigate('/login');
        }
    }
    const mytemplates = () => {
        console.log("Mis templates");
    }
    return (
        <Navbar>
            <Nav>
                <Nav.Item>Welcome {user.name}</Nav.Item>
                <Nav.Item onSelect={mytemplates}>My Templates</Nav.Item>
                <Nav.Item>Forms</Nav.Item>
            </Nav>
            <Nav pullRight>
                <Nav.Item onSelect={logout} icon={<ExitIcon/>}>Logout</Nav.Item>
            </Nav>
        </Navbar>
    );
}

export default NavigationBar;