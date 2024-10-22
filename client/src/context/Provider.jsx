import { createContext, useState } from "react";

export const AppContext = createContext();

function Provider({ children }) {
    const readLocalObject = (key,isArray) => {
        const data = localStorage.getItem(key);
        if(!data) {
            return isArray ? []:null;
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
    const [page,setPage] = useState();
    const [user, setUser] = useState(readLocalObject("user",false));
    const [userTemplates, setUserTemplates] = useState(readLocalObject("userTemplates",true));
    const [template, setTemplate] = useState(readLocalObject("template",false));
    const [questions,setQuestions] = useState(readLocalObject("questions",true));
    const [reorder,setReorder] = useState(false);
    const [form,setForm] = useState();
    const [availableTopics,setAvailableTopics] = useState([]);
    const [theme,setTheme] = useState("dark");
    return (
        <AppContext.Provider value={{ user, setUser, userTemplates, setUserTemplates, template, setTemplate, page, setPage, questions, setQuestions, reorder, setReorder, form, setForm, resetState, availableTopics, setAvailableTopics, theme, setTheme }}>
            {children}
        </AppContext.Provider>
    );
}

export default Provider;