import { useEffect } from "react";
import ExplodingImage from "./shrink";
import MatrixOutlineWord from "./matrix";

interface SequenceProps {
  showExplosion?: boolean;
  showMatrix?: boolean;
}

const Sequence: React.FC<SequenceProps> = ({ showExplosion = true, showMatrix = false }) => {
  return (
    <div style={{ backgroundColor: "#000", width: "100vw", height: "100vh", position: "relative" }}>
      {showExplosion && !showMatrix && <ExplodingImage />}
      {showMatrix && !showExplosion && <MatrixOutlineWord />}
    </div>
  );
};

export default Sequence;
