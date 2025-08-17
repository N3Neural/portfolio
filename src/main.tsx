import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Sequence from './pages/Loading/loading'
import MainScreen from './pages/MainScreen/MainScreen'

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
      // Clean up scripts on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      if (document.body.contains(datGui)) {
        document.body.removeChild(datGui)
      }
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
        zIndex: 1, // Changed from -1 to 1
        cursor: "default",
      }}
    />
  )
}

const App = () => {
  const [currentPhase, setCurrentPhase] = useState<'explosion' | 'matrix' | 'main'>('explosion');

  useEffect(() => {
    if (currentPhase === 'explosion') {
      const timer = setTimeout(() => {
        setCurrentPhase('matrix');
      }, 2700);
      return () => clearTimeout(timer);
    } else if (currentPhase === 'matrix') {
      const timer = setTimeout(() => {
        setCurrentPhase('main');
      }, 4500); // Matrix runs for exactly 3 seconds
      return () => clearTimeout(timer);
    }
  }, [currentPhase]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {currentPhase === 'explosion' && <Sequence showExplosion={true} showMatrix={false} />}
      {currentPhase === 'matrix' && <Sequence showExplosion={false} showMatrix={true} />}
      {currentPhase === 'main' && (
        <>
          <WebGLFluidSimulation />
          <MainScreen />
        </>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
