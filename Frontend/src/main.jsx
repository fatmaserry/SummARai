import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster
      containerStyle={{
        zIndex: 9999,
      }}
      toastOptions={{
        style: {
          fontSize: '20px',
          zIndex: 99999,
        },
      }}
    />
    <App />
  </React.StrictMode>,
)
