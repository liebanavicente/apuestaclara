import { TEAM_TO_CODE } from '@/app/(main)/mundial/groups'

/** Short label for a team button — FIFA code if known, else smart abbreviation */
export function teamShort(apiName: string): string {
  const code = TEAM_TO_CODE.get(apiName.toLowerCase())
  if (code) return code
  const words = apiName.trim().split(' ')
  if (words.length === 1) return words[0]
  if (words.length === 2) return `${words[0][0]}. ${words[1]}`
  return words.map(w => w[0]).join('').toUpperCase()
}
