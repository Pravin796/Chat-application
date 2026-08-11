import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AllRoutes from './config/routes'
import { Toaster } from 'react-hot-toast'
import { ChatProvider } from './context/ChatContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <AllRoutes />
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>,
)
