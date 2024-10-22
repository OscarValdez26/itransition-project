import HomeTemplates from '../components/homeTemplates.jsx';
import NavbarHome from '../components/navbarHome.jsx';
import { useContext, useEffect } from 'react';
import { AppContext } from '../context/Provider.jsx';

function Home() {
  const { page, setPage } = useContext(AppContext);
  useEffect(()=>{
    setPage("popularTemplates");
  },[])
  return (
    <div>
      <NavbarHome/>
      {page === "popularTemplates" && <HomeTemplates group={'/popular'}/>}
      {page === "latestTemplates" && <HomeTemplates group={'/latest'}/>}
    </div>
  );
}

export default Home;