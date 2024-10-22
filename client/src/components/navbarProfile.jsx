import { useContext } from 'react';
import { Navbar, Nav } from 'rsuite';
import { AppContext } from '../context/Provider';
import { getRequest } from '../api/api';
import { useNavigate } from 'react-router-dom';
import ExitIcon from '@rsuite/icons/Exit';
import GearIcon from '@rsuite/icons/Gear';
import { useTranslation } from "react-i18next";
import Theme from './theme';
import Language from './language';

function NavigationBar() {
    const { user, setPage, resetState } = useContext(AppContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const logout = async () => {
        const result = await getRequest('/logout');
        if (result === "Logout OK") {
            clearLocalStorage();
            resetState();
            navigate('/');
        }
    }
    const clearLocalStorage = () => {
        const aspect = localStorage.getItem('theme');
        const language = localStorage.getItem('lang');
        localStorage.clear();
        if (aspect) localStorage.setItem('theme', aspect);
        if (language) localStorage.setItem('lang', language);
    }
    return (
        <Navbar>
            <Nav>
                <Nav.Item>{t('Welcome')} {user.name}</Nav.Item>
                <Nav.Item onSelect={() => setPage("myTemplates")}>{t('My_templates')}</Nav.Item>
                <Nav.Item onSelect={() => setPage("publicTemplates")}>{t('Public_templates')}</Nav.Item>
                <Nav.Item onSelect={() => setPage("myForms")}>{t('My_forms')}</Nav.Item>
            </Nav>
            <Nav pullRight>
            <Nav.Menu icon={<GearIcon />}>
                <Nav.Menu title={t("Theme")} openDirection={'start'}>
                    <Nav.Item><Theme /></Nav.Item>
                </Nav.Menu>
                <Nav.Menu title={t("Language")} openDirection={'start'}>
                    <Nav.Item><Language /></Nav.Item>
                </Nav.Menu>
            </Nav.Menu>
            <Nav.Menu title={t("Logout")} icon={<ExitIcon />} onToggle={logout} noCaret/>
            </Nav>
        </Navbar>
    );
}

export default NavigationBar;