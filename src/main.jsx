import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { TradingProvider } from './context/TradingContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TradingProvider>
      <App />
    </TradingProvider>
  </StrictMode>,
)
