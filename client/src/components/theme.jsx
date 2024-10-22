import { useContext, useState } from "react";
import { HStack, Toggle, Text, SelectPicker } from "rsuite";
import { AppContext } from "../context/Provider";
import { useTranslation } from "react-i18next";

function Theme() {
    const { theme, setTheme } = useContext(AppContext);
    const { t } = useTranslation();
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
        <div className='flex justify-start p-2 m-2'>
            <Text>{t('Theme')}</Text>
            <Toggle size={'lg'} checkedChildren="light" unCheckedChildren="dark" defaultChecked={theme === "light"} onChange={changeTheme} />
        </div>     
    );
}

export default Theme;