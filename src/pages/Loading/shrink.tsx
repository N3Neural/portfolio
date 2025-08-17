import { useEffect, useRef } from "react"
import myImage from "../../assets/react.svg"

interface Dot {
  x: number
  y: number
  dx: number
  dy: number
  char: string
  size: number
  alpha: number
  fade: number
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

const ExplodingImage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const startSize = Math.sqrt(canvas.width * canvas.height * 0.25)
    const endSize = Math.sqrt(canvas.width * canvas.height * 0.05)

    const img = new Image()
    img.src = myImage

    let dots: Dot[] = []
    let isShrunk = false
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const shrinkTime = 700
    const explodeTime = 1500
    const fallTime = 1000

    let start: number | null = null

    const draw = (time: number) => {
      if (!start) start = time
      const elapsed = time - start

      ctx.fillStyle = "rgba(0,0,0,0.3)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (!isShrunk) {
        const step = Math.min(1, elapsed / shrinkTime)
        const size = startSize - (startSize - endSize) * step
        ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size)

        if (step === 1) {
          isShrunk = true
          for (let i = 0; i < 101; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = Math.random() * 150
            dots.push({
              x: cx,
              y: cy,
              dx: Math.cos(angle) * speed,
              dy: Math.sin(angle) * speed,
              char: letters[Math.floor(Math.random() * letters.length)],
              size: Math.random() * 18 + 12,
              alpha: 1,
              fade: Math.random() * 0.012 + 0.004,
            })
          }
        }
      } else if (elapsed - shrinkTime < explodeTime) {
        for (let d of dots) {
          d.dx *= 0.99
          d.dy *= 0.99
          d.x += d.dx
          d.y += d.dy
        }
      } else if (elapsed - shrinkTime < explodeTime + fallTime) {
        for (let d of dots) {
          d.y += 15
          d.alpha -= d.fade
          if (d.alpha < 0) d.alpha = 0
        }
      }

      for (let d of dots) {
        if (d.alpha <= 0) continue
        ctx.fillStyle = `rgba(0,255,0,${d.alpha})`
        ctx.font = `${d.size}px monospace`
        ctx.fillText(d.char, d.x, d.y)
      }

      requestAnimationFrame(draw)
    }

    requestAnimationFrame(draw)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 block" style={{ background: "transparent" }} />
}

export default ExplodingImage