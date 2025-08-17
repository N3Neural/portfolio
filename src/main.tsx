import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoadingScreen from './pages/Loading/loading'
import MainScreen from './pages/MainScreen/MainScreen'

function FluidCanvas() {
  useEffect(() => {
    const canvas = document.getElementById("fluid-canvas")
    if (!canvas) return

    const script = document.createElement("script")
    script.src = "/script.js"
    script.async = true
    document.body.appendChild(script)

    const gui = document.createElement("script")
    gui.src = "/dat.gui.min.js"
    gui.async = true
    document.body.appendChild(gui)

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script)
      if (document.body.contains(gui)) document.body.removeChild(gui)
    }
  }, [])

  return (
    <canvas
      id="fluid-canvas"
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        cursor: "none",
      }}
    />
  )
}

const DotCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        top: position.y - 8,
        left: position.x - 8,
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.4)",
        boxShadow: "0 0 10px rgba(255,255,255,0.6)",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  )
}

const App = () => {
  const [phase, setPhase] = useState<'explosion' | 'matrix' | 'main'>('explosion')

  useEffect(() => {
    if (phase === 'explosion') {
      const timer = setTimeout(() => setPhase('matrix'), 2700)
      return () => clearTimeout(timer)
    }
    if (phase === 'matrix') {
      const timer = setTimeout(() => setPhase('main'), 3700)
      return () => clearTimeout(timer)
    }
  }, [phase])

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", cursor: "none" }}>
      {phase === 'explosion' && <LoadingScreen showExplosion showMatrix={false} />}
      {phase === 'matrix' && <LoadingScreen showExplosion={false} showMatrix />}
      {phase === 'main' && (
        <>
          <FluidCanvas />
          <MainScreen />
          <DotCursor />
        </>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)