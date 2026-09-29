export interface Team {
  code: string
  name: string
  apiNames: string[]  // All English name variants as returned by The Odds API
}

export interface Group {
  id: string
  teams: Team[]
}

export const WC_GROUPS: Group[] = [
  { id: 'A', teams: [
    { code: 'MEX', name: 'México',          apiNames: ['Mexico'] },
    { code: 'RSA', name: 'Sudáfrica',        apiNames: ['South Africa'] },
    { code: 'KOR', name: 'Corea del Sur',   apiNames: ['South Korea', 'Korea Republic'] },
    { code: 'CZE', name: 'Chequia',         apiNames: ['Czech Republic', 'Czechia'] },
  ]},
  { id: 'B', teams: [
    { code: 'CAN', name: 'Canadá',                  apiNames: ['Canada'] },
    { code: 'BIH', name: 'Bosnia y Herzegovina',    apiNames: ['Bosnia and Herzegovina', 'Bosnia & Herzegovina', 'Bosnia-Herzegovina'] },
    { code: 'QAT', name: 'Qatar',                   apiNames: ['Qatar'] },
    { code: 'SUI', name: 'Suiza',                   apiNames: ['Switzerland'] },
  ]},
  { id: 'C', teams: [
    { code: 'BRA', name: 'Brasil',     apiNames: ['Brazil'] },
    { code: 'MAR', name: 'Marruecos', apiNames: ['Morocco'] },
    { code: 'HAI', name: 'Haití',     apiNames: ['Haiti'] },
    { code: 'SCO', name: 'Escocia',   apiNames: ['Scotland'] },
  ]},
  { id: 'D', teams: [
    { code: 'EUA', name: 'Estados Unidos', apiNames: ['USA', 'United States'] },
    { code: 'PAR', name: 'Paraguay',       apiNames: ['Paraguay'] },
    { code: 'AUS', name: 'Australia',      apiNames: ['Australia'] },
    { code: 'TUR', name: 'Turquía',        apiNames: ['Turkey', 'Türkiye'] },
  ]},
  { id: 'E', teams: [
    { code: 'ALE', name: 'Alemania',         apiNames: ['Germany'] },
    { code: 'CUR', name: 'Curacao',          apiNames: ['Curacao', 'Curaçao'] },
    { code: 'CIV', name: 'Costa de Marfil', apiNames: ['Ivory Coast', "Côte d'Ivoire", 'Cote d\'Ivoire'] },
    { code: 'ECU', name: 'Ecuador',          apiNames: ['Ecuador'] },
  ]},
  { id: 'F', teams: [
    { code: 'NED', name: 'Países Bajos', apiNames: ['Netherlands'] },
    { code: 'JPN', name: 'Japón',        apiNames: ['Japan'] },
    { code: 'SUE', name: 'Suecia',       apiNames: ['Sweden'] },
    { code: 'TUN', name: 'Túnez',        apiNames: ['Tunisia'] },
  ]},
  { id: 'G', teams: [
    { code: 'BEL', name: 'Bélgica',        apiNames: ['Belgium'] },
    { code: 'EGI', name: 'Egipto',         apiNames: ['Egypt'] },
    { code: 'IRN', name: 'Irán',           apiNames: ['IR Iran', 'Iran'] },
    { code: 'NZL', name: 'Nueva Zelanda', apiNames: ['New Zealand'] },
  ]},
  { id: 'H', teams: [
    { code: 'ESP', name: 'España',         apiNames: ['Spain'] },
    { code: 'CAV', name: 'Cabo Verde',     apiNames: ['Cape Verde'] },
    { code: 'SAU', name: 'Arabia Saudita', apiNames: ['Saudi Arabia'] },
    { code: 'URU', name: 'Uruguay',        apiNames: ['Uruguay'] },
  ]},
  { id: 'I', teams: [
    { code: 'FRA', name: 'Francia',  apiNames: ['France'] },
    { code: 'SEN', name: 'Senegal', apiNames: ['Senegal'] },
    { code: 'IRK', name: 'Irak',    apiNames: ['Iraq'] },
    { code: 'NOR', name: 'Noruega', apiNames: ['Norway'] },
  ]},
  { id: 'J', teams: [
    { code: 'ARG', name: 'Argentina', apiNames: ['Argentina'] },
    { code: 'ALG', name: 'Argelia',   apiNames: ['Algeria'] },
    { code: 'AUT', name: 'Austria',   apiNames: ['Austria'] },
    { code: 'JOR', name: 'Jordania',  apiNames: ['Jordan'] },
  ]},
  { id: 'K', teams: [
    { code: 'POR', name: 'Portugal',          apiNames: ['Portugal'] },
    { code: 'RDC', name: 'Rep. D. del Congo', apiNames: ['DR Congo', 'Democratic Republic of Congo', 'Democratic Republic of the Congo', 'Congo DR'] },
    { code: 'UZB', name: 'Uzbekistán',        apiNames: ['Uzbekistan'] },
    { code: 'COL', name: 'Colombia',          apiNames: ['Colombia'] },
  ]},
  { id: 'L', teams: [
    { code: 'ENG', name: 'Inglaterra', apiNames: ['England'] },
    { code: 'CRO', name: 'Croacia',    apiNames: ['Croatia'] },
    { code: 'GHA', name: 'Ghana',      apiNames: ['Ghana'] },
    { code: 'PAN', name: 'Panamá',     apiNames: ['Panama'] },
  ]},
]

export const TEAM_TO_GROUP = new Map<string, string>()
export const TEAM_TO_CODE = new Map<string, string>()  // api name (lower) → FIFA code

for (const group of WC_GROUPS) {
  for (const team of group.teams) {
    for (const apiName of team.apiNames) {
      const lower = apiName.toLowerCase()
      TEAM_TO_GROUP.set(lower, group.id)
      TEAM_TO_CODE.set(lower, team.code)
    }
  }
}

export function getGroupForMatch(homeTeam: string, awayTeam: string): string | null {
  return TEAM_TO_GROUP.get(homeTeam.toLowerCase())
    ?? TEAM_TO_GROUP.get(awayTeam.toLowerCase())
    ?? null
}

/** Short label for a button — FIFA code if known, else smart abbreviation */
export function teamShort(apiName: string): string {
  const code = TEAM_TO_CODE.get(apiName.toLowerCase())
  if (code) return code
  const words = apiName.trim().split(' ')
  if (words.length === 1) return words[0]
  if (words.length === 2) return `${words[0][0]}. ${words[1]}`
  return words.map(w => w[0]).join('').toUpperCase()
}
