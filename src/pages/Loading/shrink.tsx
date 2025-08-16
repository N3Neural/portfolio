import { useEffect, useRef } from "react";
import myImage from "../../assets/react.svg";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const ExplodingImage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const startSize = Math.sqrt(canvas.width * canvas.height * 0.25);
    const endSize = Math.sqrt(canvas.width * canvas.height * 0.05);

    const image = new Image();
    image.src = myImage;

    let particles: Particle[] = [];
    let shrinkingDone = false;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const shrinkDuration = 500;
    const explodeDuration = 1200;
    const fallDuration = 500;

    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!shrinkingDone) {
        const progress = Math.min(1, elapsed / shrinkDuration);
        const size = startSize - (startSize - endSize) * progress;

        ctx.drawImage(image, centerX - size / 2, centerY - size / 2, size, size);

        if (progress === 1) {
          shrinkingDone = true;

          const totalParticles = 1500;
          for (let i = 0; i < totalParticles; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 150;
            particles.push({
              x: centerX,
              y: centerY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              char: chars[Math.floor(Math.random() * chars.length)],
              size: Math.random() * 20 + 12,
            });
          }
        }
      } else if (elapsed - shrinkDuration < explodeDuration) {
        const friction = 0.995;
        for (let p of particles) {
          p.vx *= friction;
          p.vy *= friction;
          p.x += p.vx;
          p.y += p.vy;
        }
      } else if (elapsed - shrinkDuration < explodeDuration + fallDuration) {
        const gravity = 20;
        for (let p of particles) {
          p.y += gravity;
        }
      }

      for (let p of particles) {
        ctx.fillStyle = "#0F0";
        ctx.font = `${p.size}px monospace`;
        ctx.fillText(p.char, p.x, p.y);
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 block" style={{ background: "transparent" }} />;
};

export default ExplodingImage;