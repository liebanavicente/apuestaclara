'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from './Header'
import { FriendSelectorModal } from '@/components/club/FriendSelectorModal'
import type { Friend } from '@/lib/services/club.service'

interface HeaderWrapperProps {
  friend?: Friend | null
  isAdmin?: boolean
}

export function HeaderWrapper({ friend, isAdmin }: HeaderWrapperProps) {
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
        isAdmin={isAdmin}
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
