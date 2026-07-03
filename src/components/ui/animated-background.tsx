"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  pulseSpeed: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const c = canvas as HTMLCanvasElement
    const cx = ctx as CanvasRenderingContext2D

    let animationId: number
    let particles: Particle[] = []
    const PARTICLE_COUNT = 80
    const CONNECTION_DIST = 150
    let cw = 0
    let ch = 0

    function resize() {
      cw = window.innerWidth
      ch = window.innerHeight
      c.width = cw
      c.height = ch
      initParticles()
    }

    function initParticles() {
      particles = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * cw,
          y: Math.random() * ch,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.4 + 0.1,
          pulseSpeed: Math.random() * 0.02 + 0.005,
        })
      }
    }

    resize()

    function animate(time: number) {
      cx.clearRect(0, 0, cw, ch)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = cw
        if (p.x > cw) p.x = 0
        if (p.y < 0) p.y = ch
        if (p.y > ch) p.y = 0

        const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * p.pulseSpeed))
        cx.beginPath()
        cx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        cx.fillStyle = `rgba(108, 99, 255, ${pulseAlpha})`
        cx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.08
            cx.beginPath()
            cx.moveTo(particles[i].x, particles[i].y)
            cx.lineTo(particles[j].x, particles[j].y)
            cx.strokeStyle = `rgba(108, 99, 255, ${alpha})`
            cx.lineWidth = 0.5
            cx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    window.addEventListener("resize", resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  )
}
