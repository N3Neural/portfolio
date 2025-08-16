import { useEffect, useRef } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const MatrixRain: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const fontSize = 25;
        let columns = Math.floor(window.innerWidth / fontSize);
        let drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * 1000));

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const fps = 15;
        const interval = 1000 / fps;
        let lastTime = 0;

        const draw = (time: number) => {
            requestAnimationFrame(draw);
            if (time - lastTime < interval) return;
            lastTime = time;

            ctx.fillStyle = "rgba(0,0,0,0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#0F0";
            ctx.font = `${fontSize}px monospace`;

            drops.forEach((y, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, y * fontSize);
                drops[i] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
            });
        };

        requestAnimationFrame(draw);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.floor(canvas.width / fontSize);
            drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * canvas.height / fontSize));
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return <canvas ref={canvasRef} className="block w-full h-full" />;
};

export default MatrixRain;