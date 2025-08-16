import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Sequence from './pages/Loading/loading'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sequence/>
  </StrictMode>,
)
