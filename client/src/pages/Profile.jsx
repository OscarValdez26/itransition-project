import NavigationBar from "../components/navbar";
import { useContext, useEffect, useState } from "react";
import { postRequest } from "../api/api.js";
import { AppContext } from "../context/Provider.jsx";
import TableTemplates from "../components/table.jsx";

function Profile() {
    const { user, setUserTemplates, page, setPage } = useContext(AppContext);
    useEffect(()=>{
        const request = async () => {
            const result = await postRequest('/getUserTemplates',{id:user.id});
            setUserTemplates(result);
        }
        request();
    },[user.id]);
    return ( 
        <div>
            <NavigationBar setPage={setPage}/>
            {page === "mytemplates" && <TableTemplates/>}
            {page === "forms" && <div>Aqui van los forms</div>}
        </div>
     );
}

export default Profile;