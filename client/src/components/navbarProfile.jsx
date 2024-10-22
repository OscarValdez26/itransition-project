import { useContext } from 'react';
import { Navbar, Nav } from 'rsuite';
import { AppContext } from '../context/Provider';
import { getRequest } from '../api/api';
import { useNavigate } from 'react-router-dom';
import ExitIcon from '@rsuite/icons/Exit';
import { useTranslation } from "react-i18next";

function NavigationBar() {
    const { user, setPage, resetState } = useContext(AppContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const logout = async () => {
        const result = await getRequest('/logout');
        if(result === "Logout OK") {
            clearLocalStorage();
            resetState();
            navigate('/login');
        }
    }
    const clearLocalStorage = () => {
        const aspect = localStorage.getItem('theme');
        const language = localStorage.getItem('lang');
        localStorage.clear();
        if(aspect) localStorage.setItem('theme',aspect);
        if(language) localStorage.setItem('lang',language);
    }
    return (
        <Navbar>
            <Nav>
                <Nav.Item>{t('Welcome')} {user.name}</Nav.Item>
                <Nav.Item onSelect={()=>setPage("myTemplates")}>My Templates</Nav.Item>
                <Nav.Item onSelect={()=>setPage("publicTemplates")}>Public Templates</Nav.Item>
            </Nav>
            <Nav pullRight>
                <Nav.Item onSelect={logout} icon={<ExitIcon/>}>Logout</Nav.Item>
            </Nav>
        </Navbar>
    );
}

export default NavigationBar;