'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export const INTRO_SEEN_KEY = 'gb_intro_seen'

// Runs in <head> before first paint: hides the intro when it was already seen
// this session or the user prefers reduced motion, so there is no flash.
export const INTRO_BOOT_SCRIPT = `try{if(sessionStorage.getItem('${INTRO_SEEN_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('gb-intro-skip')}else{document.documentElement.classList.add('gb-intro-active')}}catch(e){}`

const INTRO_SRC = '/video/intro.mp4'
const INTRO_POSTER = '/video/intro-poster.jpg'
const START_TIMEOUT_MS = 4000 // give up if the video can't start (slow network)
const FADE_MS = 700

export function IntroSplash() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<'playing' | 'leaving' | 'gone'>('playing')
  const [muted, setMuted] = useState(true)
  const finishedRef = useRef(false)

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    try { sessionStorage.setItem(INTRO_SEEN_KEY, '1') } catch {}
    document.documentElement.classList.remove('gb-intro-active')
    videoRef.current?.pause()
    setPhase('leaving')
    window.setTimeout(() => setPhase('gone'), FADE_MS)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (root.classList.contains('gb-intro-skip')) {
      finishedRef.current = true
      return
    }
    const video = videoRef.current
    if (!video) return

    let started = false
    const onPlaying = () => { started = true }
    video.addEventListener('playing', onPlaying)
    // src is set here (not in markup) so skipped visits never download the video
    video.poster = INTRO_POSTER
    video.src = INTRO_SRC
    video.play().catch(finish) // autoplay blocked (e.g. iOS low power mode)
    const timer = window.setTimeout(() => { if (!started) finish() }, START_TIMEOUT_MS)

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      video.removeEventListener('playing', onPlaying)
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer)
    }
  }, [finish])

  function toggleSound() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  if (phase === 'gone') return null

  return (
    <div
      className={`gb-intro fixed inset-0 z-[100] bg-black overflow-hidden transition-[opacity,transform] ease-out ${
        phase === 'leaving' ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      aria-label="Vídeo de bienvenida"
      role="dialog"
    >
      {/* Blurred fill for portrait screens, where the 16:9 video is letterboxed */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-60"
        style={{ backgroundImage: `url(${INTRO_POSTER})` }}
      />

      <video
        ref={videoRef}
        className="relative w-full h-full object-contain landscape:object-cover"
        muted
        playsInline
        preload="auto"
        onEnded={finish}
      />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex items-end justify-between gap-3 bg-gradient-to-t from-black/50 to-transparent">
        <button
          onClick={toggleSound}
          aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-white/15 border border-white/20 backdrop-blur-xl hover:bg-white/25 transition-colors"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <button
          onClick={finish}
          autoFocus
          className="h-11 px-5 rounded-full text-sm font-semibold text-white bg-white/15 border border-white/20 backdrop-blur-xl hover:bg-white/25 transition-colors"
        >
          Saltar intro
        </button>
      </div>
    </div>
  )
}
