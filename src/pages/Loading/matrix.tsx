import { useEffect, useRef } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const targetWord = "ARSH GOYAL";

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 30;
    const columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(0).map(() => Math.random() * canvas.height);

    const particles: {
      x: number;
      y: number;
      char: string;
      tx?: number;
      ty?: number;
      alpha: number;
    }[] = [];

    for (let i = 0; i < columns * 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        char: chars[Math.floor(Math.random() * chars.length)],
        alpha: 1,
      });
    }

    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d")!;
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;

    const fontSizeWord = Math.min(canvas.width * 0.12, canvas.height * 0.2);
    offCtx.font = `${fontSizeWord}px monospace`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillStyle = "white";

    const letters = targetWord.split("");
    const spacing = fontSizeWord * 0.75;
    letters.forEach((letter, i) => {
      const xPos = canvas.width / 2 - (letters.length / 2) * spacing + i * spacing + spacing / 2;
      offCtx.fillText(letter, xPos, canvas.height / 2);
    });

    // Measure text width for underline
    const textWidth = offCtx.measureText(targetWord).width;

    const pixels = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;
    const targets: { x: number; y: number }[] = [];
    for (let y = 0; y < offCanvas.height; y += 4) {
      for (let x = 0; x < offCanvas.width; x += 4) {
        const idx = (y * offCanvas.width + x) * 4 + 3;
        if (pixels[idx] > 128) targets.push({ x, y });
      }
    }

    let converging = false;
    let underlineProgress = 0;
    let fadeUp = false;
    let fadeOffset = 0;

    setTimeout(() => {
      converging = true;
      particles.forEach((p, i) => {
        const t = targets[i % targets.length];
        p.tx = t.x;
        p.ty = t.y;
      });
    }, 1500);

    const fps = 25;
    const interval = 1000 / fps;
    let lastTime = 0;

    function animate(time: number) {
      requestAnimationFrame(animate);
      if (time - lastTime < interval) return;
      lastTime = time;

      if (!fadeUp) {
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;

        if (!converging) {
          ctx.fillStyle = "#0F0";
          drops.forEach((y, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            ctx.fillText(char, x, y * fontSize);
            drops[i] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
          });
        } else {
          for (let p of particles) {
            if (p.tx !== undefined && p.ty !== undefined && p.alpha > 0) {
              p.x += (p.tx - p.x) * 0.25;
              p.y += (p.ty - p.y) * 0.25;
            }

            if (p.alpha > 0) {
              ctx.fillStyle = `rgba(0,255,0,${p.alpha})`;
              ctx.fillText(p.char, p.x, p.y);
            }
          }

          underlineProgress += 0.02;
          if (underlineProgress > 1) {
            underlineProgress = 1;
            fadeUp = true;
          }

          const underlineY = canvas.height / 2 + fontSizeWord / 2 + 20;
          const underlineWidth = textWidth * underlineProgress;

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
        // Fade everything upwards
        fadeOffset += 2; // speed of upward fade
        ctx.drawImage(canvas, 0, -fadeOffset, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(animate);

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-full" />;
};

export default MatrixRain;
