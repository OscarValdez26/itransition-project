import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'rsuite/dist/rsuite.min.css';
import './index.css'
import Provider from './context/Provider.jsx';
import './i18n.js'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)
