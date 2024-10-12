import { createContext, useState } from "react";

export const AppContext = createContext();

function Provider({ children }) {
    // const getLocalUser = () => {
    //     const id = localStorage.getItem("userId");
    //     const name = localStorage.getItem("userName");
    //     const email = localStorage.getItem("userEmail");
    //     if (id && name && email) {
    //         const jsonUser = {
    //             "id": id,
    //             "name": name,
    //             "email": email
    //         }
    //         return (jsonUser);
    //     }
    //     return null;
    // }
    // const [user, setUser] = useState(getLocalUser);
    const [user, setUser] = useState();
    const [userTemplates, setUserTemplates] = useState([]);
    const [template, setTemplate] = useState();
    return (
        <AppContext.Provider value={{ user, setUser, userTemplates, setUserTemplates, template, setTemplate }}>
            {children}
        </AppContext.Provider>
    );
}

export default Provider;