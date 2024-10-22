import { useContext, useState } from 'react';
import { Navbar, Nav } from 'rsuite';
import { AppContext } from '../context/Provider.jsx';
import { useTranslation } from 'react-i18next';

function NavbarTemplate({includeForms}) {
    const { user, setPage } = useContext(AppContext);
    const { t } = useTranslation();
    const [showForms,setShowForms] = useState(includeForms);
    return ( 
        <Navbar>
            <Nav>
                <Nav.Item onSelect={()=>setPage("configuration")} >{t('Configuration')}</Nav.Item>
                <Nav.Item onSelect={()=>setPage("questions")}>{t('Questions')}</Nav.Item>
                {showForms && <Nav.Item onSelect={()=>setPage("forms")}>{t('Forms')}</Nav.Item>}
            </Nav>
        </Navbar>
    );
}

export default NavbarTemplate;