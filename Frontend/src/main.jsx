import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './components/Auth/AuthProvider.jsx'
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n/i18n.js'; 

createRoot(document.getElementById('root')).render(

  <AuthProvider>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </AuthProvider>,
)
