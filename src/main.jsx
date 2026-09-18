import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AtsProvider } from './context/AtsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AtsProvider>
        <App />
      </AtsProvider>
    </BrowserRouter>
  </StrictMode>,
)


