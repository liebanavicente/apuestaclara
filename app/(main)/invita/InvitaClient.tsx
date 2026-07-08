'use client'
import { useState } from 'react'
import { Copy, Check, MessageCircle, Send } from 'lucide-react'

interface InvitaClientProps {
  referralUrl: string
  myReferrals: number
}

export function InvitaClient({ referralUrl, myReferrals }: InvitaClientProps) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const message = encodeURIComponent(`Analiza tus combinadas deportivas con inteligencia artificial antes de apostar. Herramienta de análisis responsable, sin promesas de ganancias. Regístrate gratis: ${referralUrl}`)

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="rounded-xl border border-superficie-hover bg-superficie/50 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-texto-secundario">Tus referidos validados</p>
          <p className="text-2xl font-bold text-white">{myReferrals}</p>
        </div>
        {myReferrals >= 1 && (
          <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-full">
            ¡Premio desbloqueado!
          </span>
        )}
      </div>

      {/* Link */}
      <div>
        <label className="block text-sm text-texto-secundario mb-1.5">Tu enlace personal</label>
        <div className="flex gap-2">
          <input
            readOnly
            value={referralUrl}
            className="flex-1 rounded-lg border border-superficie-hover bg-superficie-hover px-3 py-2.5 text-texto-secundario text-sm font-mono focus:outline-none"
          />
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-superficie-hover bg-superficie-hover hover:bg-superficie-hover text-texto-secundario hover:text-white transition-colors text-sm"
          >
            {copied ? <Check className="h-4 w-4 text-teal-400" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div>
        <p className="text-sm text-texto-secundario mb-3">Compartir en redes</p>
        <div className="grid grid-cols-3 gap-3">
          <a
            href={`https://wa.me/?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-superficie-hover bg-superficie-hover hover:bg-green-900/30 hover:border-green-600/40 py-2.5 text-sm text-texto-secundario hover:text-green-400 transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-superficie-hover bg-superficie-hover hover:bg-blue-900/30 hover:border-blue-600/40 py-2.5 text-sm text-texto-secundario hover:text-blue-400 transition-colors"
          >
            <Send className="h-4 w-4" /> Telegram
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-superficie-hover bg-superficie-hover hover:bg-superficie-hover/80 py-2.5 text-sm text-texto-secundario hover:text-white transition-colors"
          >
            <span className="font-bold text-xs">𝕏</span> X / Twitter
          </a>
        </div>
      </div>

      <p className="text-xs text-texto-terciario text-center">
        El registro del referido debe ser válido (no desde la misma IP ni cuenta duplicada).
      </p>
    </div>
  )
}
