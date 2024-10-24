import { useContext } from 'react';
import { Navbar, Nav } from 'rsuite';
import { AppContext } from '../context/Provider';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GearIcon from '@rsuite/icons/Gear';
import Theme from './theme.jsx';
import Language from './language.jsx';

function NavbarHome() {
    const { t } = useTranslation();
    const {setPage} = useContext(AppContext);
    const navigate = useNavigate();
    return ( 
        <Navbar>
            <Nav>
                <Nav.Item onSelect={()=>setPage("popularTemplates")}>{t('Popular_templates')}</Nav.Item>
                <Nav.Item onSelect={()=>setPage("latestTemplates")} >{t('Latest_templates')}</Nav.Item>
                <Nav.Item onSelect={()=>setPage("popularTags")}>{t('Popular_tags')}</Nav.Item>
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
                <Nav.Menu onToggle={()=>navigate('/login')} title={t('Login')} noCaret/>
                <Nav.Menu onToggle={()=>navigate('/register')} title={t('Register')} noCaret/>
            </Nav>
        </Navbar>
    );
}

export default NavbarHome;