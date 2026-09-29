'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from './Header'
import { FriendSelectorModal } from '@/components/club/FriendSelectorModal'
import type { Friend } from '@/lib/services/club.service'

interface HeaderWrapperProps {
  friend?: Friend | null
  profile?: any
  access?: any
}

export function HeaderWrapper({ friend }: HeaderWrapperProps) {
  const router = useRouter()
  const [selectorOpen, setSelectorOpen] = useState(false)

  async function handleSignOut() {
    try {
      await fetch('/api/club/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    window.location.reload()
  }

  return (
    <>
      <Header
        friend={friend}
        onSignOut={handleSignOut}
        onOpenSelector={() => setSelectorOpen(true)}
      />
      <FriendSelectorModal
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        currentFriendId={friend?.id}
      />
    </>
  )
}
