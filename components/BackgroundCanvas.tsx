'use client'

import { useEffect, useRef } from 'react'

interface Dot {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const dotsRef = useRef<Dot[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const numDots = 100
    const maxDistance = 150

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createDots = () => {
      dotsRef.current = []
      for (let i = 0; i < numDots; i++) {
        dotsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          radius: 2
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < dotsRef.current.length; i++) {
        const d1 = dotsRef.current[i]
        
        // Draw dots with glow effect
        ctx.beginPath()
        ctx.fillStyle = '#00ffe5' // cyan dots
        ctx.shadowColor = '#ff00aa' // magenta glow
        ctx.shadowBlur = 12
        ctx.arc(d1.x, d1.y, d1.radius + 1, 0, Math.PI * 2)
        ctx.fill()

        // Draw lines between nearby dots
        for (let j = i + 1; j < dotsRef.current.length; j++) {
          const d2 = dotsRef.current[j]
          const dx = d1.x - d2.x
          const dy = d1.y - d2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < maxDistance) {
            ctx.strokeStyle = `rgba(0, 255, 229, ${1 - distance / maxDistance})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(d1.x, d1.y)
            ctx.lineTo(d2.x, d2.y)
            ctx.stroke()
          }
        }
      }
      
      ctx.shadowBlur = 0 // reset glow
    }

    const update = () => {
      dotsRef.current.forEach(dot => {
        dot.x += dot.vx
        dot.y += dot.vy
        
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1
      })
    }

    const animate = () => {
      update()
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      resizeCanvas()
      createDots()
    }

    // Initialize
    resizeCanvas()
    createDots()
    animate()

    // Add resize listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="background-canvas"
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        background: 'radial-gradient(circle at center, #0a0a0a 60%, #1a1a1a 100%)'
      }}
    />
  )
}