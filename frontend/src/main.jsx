import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PayPalScriptProvider } from '@paypal/react-paypal-js';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PayPalScriptProvider options={{ "client-id": "AY7-trFCxVkgu7fPI0I4L8tre8ot1sxkuUbPiSsUMnLfxcs6ldWdnFFxa_bN7ExfZ2M3C9yhIBdCF9fP" }}>
  <App />
</PayPalScriptProvider>
  </StrictMode>,
)
