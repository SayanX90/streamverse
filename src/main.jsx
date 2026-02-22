import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import AuthGate from './components/auth/AuthGate.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <AuthGate>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AuthGate>
        </AuthProvider>
    </React.StrictMode>,
)
