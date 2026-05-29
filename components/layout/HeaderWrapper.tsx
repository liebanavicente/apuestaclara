'use client'
import { useRouter } from 'next/navigation'
import { Header } from './Header'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import type { UserAccess } from '@/lib/access'

interface HeaderWrapperProps {
  profile?: Profile | null
  access?: UserAccess | null
}

export function HeaderWrapper({ profile, access }: HeaderWrapperProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return <Header profile={profile} access={access} onSignOut={handleSignOut} />
}
