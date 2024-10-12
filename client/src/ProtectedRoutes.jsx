import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "./context/Provider";

function ProtectedRoutes(){
    const { user } = useContext(AppContext);
    if(!user){
        return <Navigate to="/login" replace/>
    }
    return(
        <Outlet/>
    );
}

export default ProtectedRoutes;
