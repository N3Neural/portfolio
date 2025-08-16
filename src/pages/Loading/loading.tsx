import { useEffect, useState } from "react";
import ExplodingImage from "./shrink";
import MatrixOutlineWord from "./matrix";

const Sequence: React.FC = () => {
  const [showMatrix, setShowMatrix] = useState(false);
  const [showExplosion, setShowExplosion] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMatrix(true);
      setShowExplosion(false);
    }, 2100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ backgroundColor: "#000", width: "100vw", height: "100vh", position: "relative" }}>
      {showExplosion && <ExplodingImage />}
      {showMatrix && <MatrixOutlineWord />}
    </div>
  );
};

export default Sequence;