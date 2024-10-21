import NavigationBar from "../components/navbarProfile.jsx";
import { useContext, useEffect } from "react";
import { postRequest } from "../api/api.js";
import { AppContext } from "../context/Provider.jsx";
import TableTemplates from "../components/tableTemplates.jsx";
import PublicTemplates from "../components/publicTemplates.jsx";

function Profile() {
    const { user,userTemplates, setUserTemplates, page, setPage, setTemplate, setQuestions } = useContext(AppContext);
    useEffect(()=>{
        const request = async () => {
            console.log("Getting User Templates");
            const result = await postRequest('/getUserTemplates',{id:user.id});
            if(!result) return alert("Something went wrong");
            localStorage.setItem("userTemplates",JSON.stringify(result));
            setUserTemplates(result);
        }  
        setPage("myTemplates");
        setTemplate();
        setQuestions([]);
        localStorage.removeItem("template");
        localStorage.removeItem("questions");
        if(userTemplates.length === 0) request(); 
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