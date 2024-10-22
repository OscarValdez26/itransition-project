import { useContext, useState } from "react";
import { HStack, Toggle, Text, SelectPicker } from "rsuite";
import { AppContext } from "../context/Provider";
import { useTranslation } from "react-i18next";

function Settings() {
    const { theme, setTheme, lang, setLang } = useContext(AppContext);
    const languages = [{ "label": "Español", "value": "Español" }, { "label": "English", "value": "English" }];
    const { t, i18n } = useTranslation();
    const getLang = () => {
        switch (lang) {
            case 'es':
                return "Español";
            case 'en':
                return "English";
            default:
                break;
        }
    }
    const [defLang, setDefLang] = useState(getLang);
    const changeLanguage = (language) => {
        setLang(language);
        switch (language) {
            case 'Español':
                localStorage.setItem('lang', 'es');
                i18n.changeLanguage('es');
                break;
            case 'English':
                i18n.changeLanguage('en');
                localStorage.setItem('lang', 'en');
                break;
            default:
                break;
        }
    }
    const changeTheme = (e) => {
        if (e) {
            setTheme("light");
            localStorage.setItem('theme', 'light');
        }
        else {
            setTheme("dark");
            localStorage.setItem('theme', 'dark');
        }
    }
    return (
        <div className='flex justify-end p-2 m-2'>
            <HStack>
            <Text>{t('Theme')}</Text>
            <Toggle size={'lg'} checkedChildren="light" unCheckedChildren="dark" defaultChecked={theme === "light"} onChange={changeTheme} />
            <Text>{t('Language')}</Text>
            <SelectPicker data={languages} value={lang} onChange={changeLanguage} searchable={false} style={{ width: 224 }} placeholder={defLang} />
        </HStack>
        </div>     
    );
}

export default Settings;