export interface Group {
  id: string
  teams: string[]       // display names (Spanish)
  apiNames: string[]    // names as returned by The Odds API (English variants)
}

export const WC_GROUPS: Group[] = [
  { id: 'A', teams: ['México', 'Sudáfrica', 'Corea del Sur', 'Chequia'],
    apiNames: ['Mexico', 'South Africa', 'South Korea', 'Czech Republic', 'Korea Republic'] },
  { id: 'B', teams: ['Canadá', 'Bosnia y Herz.', 'Catar', 'Suiza'],
    apiNames: ['Canada', 'Bosnia and Herzegovina', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'] },
  { id: 'C', teams: ['Brasil', 'Marruecos', 'Haití', 'Escocia'],
    apiNames: ['Brazil', 'Morocco', 'Haiti', 'Scotland'] },
  { id: 'D', teams: ['EE.UU.', 'Paraguay', 'Australia', 'Turquía'],
    apiNames: ['USA', 'United States', 'Paraguay', 'Australia', 'Turkey', 'Türkiye'] },
  { id: 'E', teams: ['Alemania', 'Curazao', 'Costa de Marfil', 'Ecuador'],
    apiNames: ['Germany', 'Curacao', 'Curaçao', 'Ivory Coast', "Côte d'Ivoire", 'Ecuador'] },
  { id: 'F', teams: ['Países Bajos', 'Japón', 'Suecia', 'Túnez'],
    apiNames: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'] },
  { id: 'G', teams: ['Bélgica', 'Egipto', 'Irán', 'Nueva Zelanda'],
    apiNames: ['Belgium', 'Egypt', 'IR Iran', 'Iran', 'New Zealand'] },
  { id: 'H', teams: ['España', 'Cabo Verde', 'Arabia Saudí', 'Uruguay'],
    apiNames: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'] },
  { id: 'I', teams: ['Francia', 'Senegal', 'Irak', 'Noruega'],
    apiNames: ['France', 'Senegal', 'Iraq', 'Norway'] },
  { id: 'J', teams: ['Argentina', 'Argelia', 'Austria', 'Jordania'],
    apiNames: ['Argentina', 'Algeria', 'Austria', 'Jordan'] },
  { id: 'K', teams: ['Portugal', 'RD Congo', 'Uzbekistán', 'Colombia'],
    apiNames: ['Portugal', 'DR Congo', 'Democratic Republic of Congo', 'Uzbekistan', 'Colombia'] },
  { id: 'L', teams: ['Inglaterra', 'Croacia', 'Ghana', 'Panamá'],
    apiNames: ['England', 'Croatia', 'Ghana', 'Panama'] },
]

// Build lookup: api name (lowercase) → group id
export const TEAM_TO_GROUP = new Map<string, string>()
for (const group of WC_GROUPS) {
  for (const name of group.apiNames) {
    TEAM_TO_GROUP.set(name.toLowerCase(), group.id)
  }
}

export function getGroupForMatch(homeTeam: string, awayTeam: string): string | null {
  return TEAM_TO_GROUP.get(homeTeam.toLowerCase())
    ?? TEAM_TO_GROUP.get(awayTeam.toLowerCase())
    ?? null
}
