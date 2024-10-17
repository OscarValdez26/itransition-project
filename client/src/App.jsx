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

function App() {
  //themes light dark high-contrast
  return (
    <CustomProvider theme='light'> 
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' exact element={<Login />} />
        <Route path='/register' exact element={<Register />} />
        <Route element={<ProtectedRoutes />}>
          <Route path='/profile' exact element={<Profile />} />
          <Route path='/newTemplate' exact element={<NewTemplate />} />
          <Route path='/editTemplate' exact element={<EditTemplate />} />
          <Route path='/newForm' exact element={<NewForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </CustomProvider>
  )
}

export default App
