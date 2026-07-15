import { createClient } from '@/lib/supabase/server'
import { PorraFinalCard } from '@/components/porra/PorraFinalCard'
import { PorraMagicLinkForm } from '@/components/porra/PorraMagicLinkForm'

export const metadata = { title: 'Porra de la final — GañanesBets' }

export default async function PorraPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {user ? <PorraFinalCard isLoggedIn /> : <PorraMagicLinkForm />}
    </div>
  )
}
