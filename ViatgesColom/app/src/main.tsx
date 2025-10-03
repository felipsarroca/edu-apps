import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.tsx'

const iconRetinaUrl = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url)
const iconUrl = new URL('leaflet/dist/images/marker-icon.png', import.meta.url)
const shadowUrl = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url)

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.href,
  iconUrl: iconUrl.href,
  shadowUrl: shadowUrl.href,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
