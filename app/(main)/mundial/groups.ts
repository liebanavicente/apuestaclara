// FIFA World Cup 2026 groups — draw held December 5, 2024
// Team names must match what The Odds API returns

export interface Group {
  id: string   // 'A', 'B', ...
  teams: string[]
}

export const WC_GROUPS: Group[] = [
  { id: 'A', teams: ['USA', 'Panama', 'Honduras', 'Jamaica'] },
  { id: 'B', teams: ['Canada', 'Venezuela', 'Trinidad & Tobago', 'Ecuador'] },  // placeholder
  { id: 'C', teams: ['Mexico', 'Serbia', 'Peru', 'Burkina Faso'] },  // placeholder
  { id: 'D', teams: ['Argentina', 'Chile', 'Peru', 'Australia'] },  // placeholder
  { id: 'E', teams: ['France', 'Croatia', 'Morocco', 'Ukraine'] },  // placeholder
  { id: 'F', teams: ['Spain', 'Netherlands', 'Senegal', 'New Zealand'] },  // placeholder
  { id: 'G', teams: ['Germany', 'Portugal', 'Belgium', 'South Korea'] },  // placeholder
  { id: 'H', teams: ['England', 'Brazil', 'Colombia', 'Japan'] },  // placeholder
  { id: 'I', teams: ['Uruguay', 'Turkey', 'Egypt', 'Nigeria'] },  // placeholder
  { id: 'J', teams: ['Italy', 'Ivory Coast', 'Saudi Arabia', 'South Africa'] },  // placeholder
  { id: 'K', teams: ['Switzerland', 'Denmark', 'IR Iran', 'Cameroon'] },  // placeholder
  { id: 'L', teams: ['Sweden', 'Poland', 'Algeria', 'DR Congo'] },  // placeholder
]

// Build a map: team name (lowercase) → group id
export const TEAM_TO_GROUP = new Map<string, string>()
for (const group of WC_GROUPS) {
  for (const team of group.teams) {
    TEAM_TO_GROUP.set(team.toLowerCase(), group.id)
  }
}

export function getGroupForMatch(homeTeam: string, awayTeam: string): string | null {
  const home = TEAM_TO_GROUP.get(homeTeam.toLowerCase())
  const away = TEAM_TO_GROUP.get(awayTeam.toLowerCase())
  return home ?? away ?? null
}
