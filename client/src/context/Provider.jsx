import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const AppContext = createContext();

function Provider({ children }) {
    const { i18n } = useTranslation();
    const readLocalObject = (key, isArray) => {
        const data = localStorage.getItem(key);
        if (!data) {
            return isArray ? [] : null;
        }
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('Error in JSON.parse(): ', error);
            return isArray ? [] : null;
        }
    }
    const resetState = () => {
        setPage();
        setUser();
        setUserTemplates([])
        setQuestions([]);
        setTemplate();
        setReorder(false);
        setForm();
    }
    const getTheme = () => {
        const aspect = localStorage.getItem('theme');
        if(!aspect) return "light";
        return aspect;
    }
    const getLang = () => {
        const language = localStorage.getItem('lang');
        language ? i18n.changeLanguage(language):i18n.changeLanguage('en');
        return language;
    }
    const [page, setPage] = useState();
    const [user, setUser] = useState(readLocalObject("user", false));
    const [userTemplates, setUserTemplates] = useState(readLocalObject("userTemplates", true));
    const [template, setTemplate] = useState(readLocalObject("template", false));
    const [questions, setQuestions] = useState(readLocalObject("questions", true));
    const [reorder, setReorder] = useState(false);
    const [form, setForm] = useState();
    const [availableTopics, setAvailableTopics] = useState([]);
    const [theme, setTheme] = useState(getTheme);
    const [lang, setLang] = useState(getLang);
    return (
        <AppContext.Provider value={{ user, setUser, userTemplates, setUserTemplates, template, setTemplate, page, setPage, questions, setQuestions, reorder, setReorder, form, setForm, resetState, availableTopics, setAvailableTopics, theme, setTheme, lang, setLang }}>
            {children}
        </AppContext.Provider>
    );
}

export default Provider;