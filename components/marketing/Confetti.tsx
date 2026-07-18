'use client'
import { useEffect, useRef } from 'react'

const COLORS = ['#3FF5D3', '#D7FF4F', '#FFFFFF', '#3FF5D3', '#D7FF4F']

type Piece = {
  x: number
  y: number
  size: number
  speed: number
  drift: number
  angle: number
  spin: number
  color: string
}

export function Confetti({ density = 40 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let pieces: Piece[] = []
    let raf = 0

    function makePiece(recycle = false): Piece {
      return {
        x: Math.random() * width,
        y: recycle ? -20 : Math.random() * height,
        size: 4 + Math.random() * 5,
        speed: 0.6 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 0.8,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }
    }

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent.clientWidth
      height = parent.clientHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (pieces.length === 0) {
        pieces = Array.from({ length: density }, () => makePiece())
      }
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height)
      for (const p of pieces) {
        p.y += p.speed
        p.x += p.drift
        p.angle += p.spin
        if (p.y > height + 20) Object.assign(p, makePiece(true))

        ctx!.save()
        ctx!.translate(p.x, p.y)
        ctx!.rotate(p.angle)
        ctx!.globalAlpha = 0.55
        ctx!.fillStyle = p.color
        ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx!.restore()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    />
  )
}
