import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Loading from './pages/Loading'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Loading />
  </StrictMode>,
)
