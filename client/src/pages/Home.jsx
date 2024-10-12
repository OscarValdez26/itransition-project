import { useContext } from "react";
import { AppContext } from "../context/Provider";

function Home() {
    const {user} = useContext(AppContext);
    return ( 
        <div>
            <h1>Pagina de inicio</h1>
            <p>Bienvenido {user.name}</p>
        </div>
     );
}

export default Home;