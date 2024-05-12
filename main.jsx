import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthContextProvider } from './context/GoogleAuthContext.jsx';




ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleAuthContextProvider>
            <GoogleOAuthProvider clientId="824250536567-e6dsulq3rptqpe638l1ehfoqv6j426b8.apps.googleusercontent.com">
                <App />
            </GoogleOAuthProvider>
        </GoogleAuthContextProvider>
    </StrictMode>
)
