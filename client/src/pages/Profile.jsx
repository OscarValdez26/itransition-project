import NavigationBar from "../components/navbarProfile.jsx";
import { useContext, useEffect } from "react";
import { getRequest, postRequest } from "../api/api.js";
import { AppContext } from "../context/Provider.jsx";
import TableTemplates from "../components/tableTemplates.jsx";
import PublicTemplates from "../components/publicTemplates.jsx";

function Profile() {
    const { user,userTemplates, setUserTemplates, page, setPage, setTemplate, setQuestions, availableTopics, setAvailableTopics } = useContext(AppContext);
    useEffect(()=>{
        const request = async () => {
            const result = await postRequest('/getUserTemplates',{id:user.id});
            if(!result) return alert("Something went wrong");
            localStorage.setItem("userTemplates",JSON.stringify(result));
            setUserTemplates(result);
        }
        const requestTopics = async () => {
            const result = await getRequest('/topics');
            if(!result) return alert("Something went wrong");
            localStorage.setItem("availableTopics",JSON.stringify(result));
            setAvailableTopics(result);
        } 
        setPage("myTemplates");
        setTemplate();
        setQuestions([]);
        localStorage.removeItem("template");
        localStorage.removeItem("questions");
        if(userTemplates.length === 0) request(); 
        if(availableTopics.length === 0) requestTopics(); 
    },[user.id]);
    return ( 
        <div>
            <NavigationBar setPage={setPage}/>
            {page === "myTemplates" && <TableTemplates/>}
            {page === "publicTemplates" && <PublicTemplates/>}
        </div>
     );
}

export default Profile;