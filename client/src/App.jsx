import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomProvider } from 'rsuite';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoutes from './ProtectedRoutes.jsx';
import Profile from './pages/Profile.jsx';
import NewTemplate from './pages/NewTemplate.jsx';
import EditTemplate from './pages/EditTemplate.jsx';
import NewForm from './pages/NewForm.jsx';
import EditForm from './pages/EditForm.jsx';
import SeeForm from './pages/SeeForm.jsx';
import SeeTemplate from './pages/SeeTemplate.jsx';
import { useContext } from 'react';
import { AppContext } from './context/Provider.jsx';

function App() {
  //themes light dark high-contrast
  const {theme} = useContext(AppContext);
  return (
    <CustomProvider theme={theme}> 
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' exact element={<Login />} />
        <Route path='/register' exact element={<Register />} />
        <Route path='/seeTemplate' exact element={<SeeTemplate />} />
        <Route element={<ProtectedRoutes />}>
          <Route path='/profile' exact element={<Profile />} />
          <Route path='/newTemplate' exact element={<NewTemplate />} />
          <Route path='/editTemplate' exact element={<EditTemplate />} />
          <Route path='/newForm' exact element={<NewForm />} />
          <Route path='/editForm' exact element={<EditForm />} />
          <Route path='/seeForm' exact element={<SeeForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </CustomProvider>
  )
}

export default App
