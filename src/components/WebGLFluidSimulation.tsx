import { useEffect } from 'react';

const WebGLFluidSimulation: React.FC = () => {
  useEffect(() => {
    // Load dat.gui
    const datGui = document.createElement("script");
    datGui.src = "/dat.gui.min.js";
    datGui.async = true;
    document.body.appendChild(datGui);

    // Load fluid simulation script
    const script = document.createElement("script");
    script.src = "/script.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup scripts when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.body.contains(datGui)) {
        document.body.removeChild(datGui);
      }
      
      // Remove canvas if it exists
      const existingCanvas = document.getElementById("fluid-canvas");
      if (existingCanvas) {
        existingCanvas.remove();
      }
    };
  }, []);

  return (
    <canvas
      id="fluid-canvas"
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,  // Keep canvas in background
        cursor: "default",
      }}
    />
  );
};

export default WebGLFluidSimulation;
