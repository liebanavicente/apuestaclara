const CLUB_SHORTS: Record<string, string> = {
  // LaLiga
  'real madrid': 'R. Madrid',
  'fc barcelona': 'Barça',
  'barcelona': 'Barça',
  'atlético madrid': 'Atleti',
  'atletico madrid': 'Atleti',
  'athletic club': 'Athletic',
  'athletic bilbao': 'Athletic',
  'real sociedad': 'R. Sociedad',
  'real betis': 'Betis',
  'villarreal': 'Villarreal',
  'villarreal cf': 'Villarreal',
  'sevilla': 'Sevilla',
  'sevilla fc': 'Sevilla',
  'valencia': 'Valencia',
  'valencia cf': 'Valencia',
  'girona': 'Girona',
  'girona fc': 'Girona',
  'celta vigo': 'Celta',
  'rc celta': 'Celta',
  'osasuna': 'Osasuna',
  'ca osasuna': 'Osasuna',
  'getafe': 'Getafe',
  'getafe cf': 'Getafe',
  'rayo vallecano': 'Rayo',
  'rcd mallorca': 'Mallorca',
  'mallorca': 'Mallorca',
  'rcd espanyol': 'Espanyol',
  'espanyol': 'Espanyol',
  'deportivo alavés': 'Alavés',
  'alavés': 'Alavés',
  'alaves': 'Alavés',
  'ud las palmas': 'Las Palmas',
  'las palmas': 'Las Palmas',
  'cd leganés': 'Leganés',
  'leganés': 'Leganés',
  'leganes': 'Leganés',
  'real valladolid': 'Valladolid',
  'valladolid': 'Valladolid',

  // Champions League European Clubs
  'manchester city': 'Man City',
  'manchester united': 'Man United',
  'liverpool': 'Liverpool',
  'arsenal': 'Arsenal',
  'chelsea': 'Chelsea',
  'aston villa': 'Aston Villa',
  'bayern munich': 'Bayern',
  'bayern münchen': 'Bayern',
  'borussia dortmund': 'Dortmund',
  'bayer leverkusen': 'Leverkusen',
  'rb leipzig': 'Leipzig',
  'paris saint-germain': 'PSG',
  'paris saint germain': 'PSG',
  'psg': 'PSG',
  'monaco': 'Mónaco',
  'as monaco': 'Mónaco',
  'brest': 'Brest',
  'lille': 'Lille',
  'inter milan': 'Inter',
  'internazionale': 'Inter',
  'inter': 'Inter',
  'ac milan': 'Milan',
  'milan': 'Milan',
  'juventus': 'Juventus',
  'atalanta': 'Atalanta',
  'bologna': 'Bologna',
  'benfica': 'Benfica',
  'sporting cp': 'Sporting',
  'sporting lisbon': 'Sporting',
  'porto': 'Porto',
  'fc porto': 'Porto',
  'psv eindhoven': 'PSV',
  'psv': 'PSV',
  'feyenoord': 'Feyenoord',
  'ajax': 'Ajax',
  'celtic': 'Celtic',
  'club brugge': 'Brujas',
  'shakhtar donetsk': 'Shakhtar',
  'red star belgrade': 'Estrella Roja',
  'crvena zvezda': 'Estrella Roja',
  'dinamo zagreb': 'D. Zagreb',
  'salzburg': 'Salzburgo',
  'red bull salzburg': 'Salzburgo',
  'young boys': 'Young Boys',
  'sparta prague': 'Sparta Praga',
  'slovan bratislava': 'S. Bratislava',
  'sturm graz': 'Sturm Graz',
  'galatasaray': 'Galatasaray',
  'as roma': 'Roma',
  'roma': 'Roma',
}

/** Short label for a team button — Club name if known, else smart abbreviation */
export function teamShort(apiName: string): string {
  if (!apiName) return ''
  const clean = apiName.trim().toLowerCase()
  if (CLUB_SHORTS[clean]) return CLUB_SHORTS[clean]

  for (const [k, v] of Object.entries(CLUB_SHORTS)) {
    if (clean === k || clean.startsWith(k + ' ') || clean.endsWith(' ' + k)) return v
  }

  const words = apiName.trim().split(' ')
  if (words.length === 1) return words[0]
  if (words.length === 2) return `${words[0][0]}. ${words[1]}`
  return words.map(w => w[0]).join('').toUpperCase()
}
