import { MotionGlobalConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles/app.css'

// `?static` turns motion off: for automated checks and for screenshots.
if (new URLSearchParams(location.search).has('static')) {
  MotionGlobalConfig.skipAnimations = true
  document.documentElement.classList.add('static')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
