export interface Group {
  id: string
  teams: { code: string; name: string }[]
  apiNames: string[]  // English names as returned by The Odds API
}

export const WC_GROUPS: Group[] = [
  { id: 'A',
    teams: [{ code: 'MEX', name: 'México' }, { code: 'RSA', name: 'Sudáfrica' }, { code: 'KOR', name: 'Corea del Sur' }, { code: 'CZE', name: 'Chequia' }],
    apiNames: ['Mexico', 'South Africa', 'South Korea', 'Korea Republic', 'Czech Republic', 'Czechia'] },
  { id: 'B',
    teams: [{ code: 'CAN', name: 'Canadá' }, { code: 'BIH', name: 'Bosnia y Herzegovina' }, { code: 'QAT', name: 'Qatar' }, { code: 'SUI', name: 'Suiza' }],
    apiNames: ['Canada', 'Bosnia and Herzegovina', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'] },
  { id: 'C',
    teams: [{ code: 'BRA', name: 'Brasil' }, { code: 'MAR', name: 'Marruecos' }, { code: 'HAI', name: 'Haití' }, { code: 'SCO', name: 'Escocia' }],
    apiNames: ['Brazil', 'Morocco', 'Haiti', 'Scotland'] },
  { id: 'D',
    teams: [{ code: 'EUA', name: 'Estados Unidos' }, { code: 'PAR', name: 'Paraguay' }, { code: 'AUS', name: 'Australia' }, { code: 'TUR', name: 'Turquía' }],
    apiNames: ['USA', 'United States', 'Paraguay', 'Australia', 'Turkey', 'Türkiye'] },
  { id: 'E',
    teams: [{ code: 'ALE', name: 'Alemania' }, { code: 'CUR', name: 'Curacao' }, { code: 'CIV', name: 'Costa de Marfil' }, { code: 'ECU', name: 'Ecuador' }],
    apiNames: ['Germany', 'Curacao', 'Curaçao', 'Ivory Coast', "Côte d'Ivoire", 'Ecuador'] },
  { id: 'F',
    teams: [{ code: 'NED', name: 'Países Bajos' }, { code: 'JPN', name: 'Japón' }, { code: 'SUE', name: 'Suecia' }, { code: 'TUN', name: 'Túnez' }],
    apiNames: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'] },
  { id: 'G',
    teams: [{ code: 'BEL', name: 'Bélgica' }, { code: 'EGI', name: 'Egipto' }, { code: 'IRN', name: 'Irán' }, { code: 'NZL', name: 'Nueva Zelanda' }],
    apiNames: ['Belgium', 'Egypt', 'IR Iran', 'Iran', 'New Zealand'] },
  { id: 'H',
    teams: [{ code: 'ESP', name: 'España' }, { code: 'CAV', name: 'Cabo Verde' }, { code: 'SAU', name: 'Arabia Saudita' }, { code: 'URU', name: 'Uruguay' }],
    apiNames: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'] },
  { id: 'I',
    teams: [{ code: 'FRA', name: 'Francia' }, { code: 'SEN', name: 'Senegal' }, { code: 'IRK', name: 'Irak' }, { code: 'NOR', name: 'Noruega' }],
    apiNames: ['France', 'Senegal', 'Iraq', 'Norway'] },
  { id: 'J',
    teams: [{ code: 'ARG', name: 'Argentina' }, { code: 'ALG', name: 'Argelia' }, { code: 'AUT', name: 'Austria' }, { code: 'JOR', name: 'Jordania' }],
    apiNames: ['Argentina', 'Algeria', 'Austria', 'Jordan'] },
  { id: 'K',
    teams: [{ code: 'POR', name: 'Portugal' }, { code: 'RDC', name: 'Rep. D. del Congo' }, { code: 'UZB', name: 'Uzbekistán' }, { code: 'COL', name: 'Colombia' }],
    apiNames: ['Portugal', 'DR Congo', 'Democratic Republic of Congo', 'Democratic Republic of the Congo', 'Congo DR', 'Uzbekistan', 'Colombia'] },
  { id: 'L',
    teams: [{ code: 'ENG', name: 'Inglaterra' }, { code: 'CRO', name: 'Croacia' }, { code: 'GHA', name: 'Ghana' }, { code: 'PAN', name: 'Panamá' }],
    apiNames: ['England', 'Croatia', 'Ghana', 'Panama'] },
]

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
