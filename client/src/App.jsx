import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomProvider } from 'rsuite';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoutes from './ProtectedRoutes.jsx';
import Profile from './pages/Profile.jsx';
import NewTemplate from './pages/NewTemplate.jsx';
import Template from './pages/Template.jsx';

function App() {
  //themes light dark high-contrast
  return (
    <CustomProvider theme='light'> 
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' exact element={<Login />} />
        <Route path='/register' exact element={<Register />} />
        <Route path='/template' exact element={<Template />} />
        <Route element={<ProtectedRoutes />}>
          <Route path='/profile' exact element={<Profile />} />
          <Route path='/newtemplate' exact element={<NewTemplate />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </CustomProvider>
  )
}

export default App
