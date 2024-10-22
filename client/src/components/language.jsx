import { useContext } from "react";
import { HStack, Toggle, Text } from "rsuite";
import { AppContext } from "../context/Provider";
import { useTranslation } from "react-i18next";

function Language() {
    const { lang, setLang } = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const changeLanguage = (e) => {
        console.log(e);
        if (e) {
            setLang("en");
            localStorage.setItem('lang', 'en');
            i18n.changeLanguage('en');
        }
        else {
            setLang("es");
            localStorage.setItem('lang', 'es');
            i18n.changeLanguage('es');
        }
    }
    
    return (
        <div className='flex justify-start p-2 m-2'>
            <Text>{t('Language')}</Text>
            <Toggle size={'lg'} checkedChildren="English" unCheckedChildren="Español" defaultChecked={lang === "en"} onChange={changeLanguage} />
        </div>     
    );
}

export default Language