import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Sequence from './pages/Loading/loading'

function WebGLFluidSimulation() {
  useEffect(() => {
    // Load dat.gui
    const datGui = document.createElement("script")
    datGui.src = "/dat.gui.min.js"
    datGui.async = true
    document.body.appendChild(datGui)

    // Load fluid simulation script
    const script = document.createElement("script")
    script.src = "/script.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
      document.body.removeChild(datGui)
    }
  }, [])

  return (
    <>
      {/* Canvas as fullscreen background */}
      <canvas
        id="fluid-canvas"
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,          // keep canvas in background
          cursor: "default",   // make cursor visible
        }}
      />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebGLFluidSimulation />
    <Sequence />
  </StrictMode>
)