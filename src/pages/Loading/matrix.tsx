import { useEffect, useRef } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const message = "HELLO";

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 30;
    const columnCount = Math.floor(canvas.width / fontSize);
    let columnHeights = Array(columnCount)
      .fill(0)
      .map(() => Math.random() * 200);

    const dots: {
      x: number;
      y: number;
      char: string;
      targetX?: number;
      targetY?: number;
      opacity: number;
    }[] = [];

    for (let i = 0; i < columnCount * 40; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        char: letters[Math.floor(Math.random() * letters.length)],
        opacity: 1,
      });
    }

    const hiddenCanvas = document.createElement("canvas");
    const hiddenCtx = hiddenCanvas.getContext("2d")!;
    hiddenCanvas.width = canvas.width;
    hiddenCanvas.height = canvas.height;

    const messageSize = Math.min(canvas.width * 0.12, canvas.height * 0.2);
    hiddenCtx.font = `${messageSize}px monospace`;
    hiddenCtx.textAlign = "center";
    hiddenCtx.textBaseline = "middle";
    hiddenCtx.fillStyle = "white";

    const messageChars = message.split("");
    const spacing = messageSize * 0.75;

    messageChars.forEach((ch, i) => {
      const x = canvas.width / 2 - (messageChars.length / 2) * spacing + i * spacing + spacing / 2;
      hiddenCtx.fillText(ch, x, canvas.height / 2);
    });

    const textWidth = hiddenCtx.measureText(message).width;
    const pixelData = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height).data;

    const targets: { x: number; y: number }[] = [];
    for (let y = 0; y < hiddenCanvas.height; y += 4) {
      for (let x = 0; x < hiddenCanvas.width; x += 4) {
        const index = (y * hiddenCanvas.width + x) * 4 + 3;
        if (pixelData[index] > 128) targets.push({ x, y });
      }
    }

    let mergePhase = false;
    let underlineGrow = 0;
    let fadePhase = false;
    let fadeShift = 0;

    setTimeout(() => {
      mergePhase = true;
      dots.forEach((dot, i) => {
        const { x, y } = targets[i % targets.length];
        dot.targetX = x;
        dot.targetY = y;
      });
    }, 1500);

    const fps = 25;
    const frameSpacing = 1000 / fps;
    let lastFrame = 0;

    function draw(now: number) {
      requestAnimationFrame(draw);
      if (now - lastFrame < frameSpacing) return;
      lastFrame = now;

      if (!fadePhase) {
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px monospace`;

        if (!mergePhase) {
          ctx.fillStyle = "#0F0";
          columnHeights.forEach((height, i) => {
            const char = letters[Math.floor(Math.random() * letters.length)];
            const x = i * fontSize;
            ctx.fillText(char, x, height * fontSize);
            columnHeights[i] = height * fontSize > canvas.height && Math.random() > 0.975 ? 0 : height + 1;
          });
        } else {
          for (let dot of dots) {
            if (dot.targetX !== undefined && dot.targetY !== undefined && dot.opacity > 0) {
              dot.x += (dot.targetX - dot.x) * 0.25;
              dot.y += (dot.targetY - dot.y) * 0.25;
            }

            if (dot.opacity > 0) {
              ctx.fillStyle = `rgba(0,255,0,${dot.opacity})`;
              ctx.fillText(dot.char, dot.x, dot.y);
            }
          }

          underlineGrow += 0.02;
          if (underlineGrow > 1) {
            underlineGrow = 1;
            fadePhase = true;
          }

          const underlineY = canvas.height / 2 + messageSize / 2 + 20;
          const underlineWidth = textWidth * underlineGrow;

          ctx.save();
          ctx.strokeStyle = "lime";
          ctx.shadowColor = "lime";
          ctx.shadowBlur = 20;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - underlineWidth / 2, underlineY);
          ctx.lineTo(canvas.width / 2 + underlineWidth / 2, underlineY);
          ctx.stroke();
          ctx.restore();
        }
      } else {
        fadeShift += 2;
        ctx.drawImage(canvas, 0, -fadeShift, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(draw);

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-full" />;
};

export default MatrixRain;