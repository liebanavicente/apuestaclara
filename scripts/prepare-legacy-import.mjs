import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const importsDir = path.join(root, 'imports')
const profilesPath = path.join(importsDir, 'old_profiles.csv')
const picksPath = path.join(importsDir, 'old_picks.csv')

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"') quoted = true
    else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (char !== '\r') {
      field += char
    }
  }

  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }

  const header = rows.shift()
  return rows
    .filter(values => values.length && values.some(Boolean))
    .map(values => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ''])))
}

function sqlString(value) {
  if (value == null || value === '') return 'null'
  return `'${String(value).replaceAll("'", "''")}'`
}

function sqlBool(value) {
  return value === 'true' ? 'true' : 'false'
}

function sqlNumeric(value, fallback = 'null') {
  if (value == null || value === '') return fallback
  const number = Number(value)
  return Number.isFinite(number) ? String(number) : fallback
}

function sqlJson(value) {
  if (!value) return 'null'
  try {
    return `${sqlString(JSON.stringify(JSON.parse(value)))}::jsonb`
  } catch {
    return 'null'
  }
}

const profiles = parseCsv(fs.readFileSync(profilesPath, 'utf8'))
const picks = parseCsv(fs.readFileSync(picksPath, 'utf8'))

const statsByUser = new Map(
  profiles.map(profile => [
    profile.user_id,
    {
      email: profile.email,
      username: profile.username,
      total: 0,
      won: 0,
      lost: 0,
      pending: 0,
      points: 0,
    },
  ])
)

let missingUserPicks = 0
for (const pick of picks) {
  const stats = statsByUser.get(pick.user_id)
  if (!stats) {
    missingUserPicks++
    continue
  }

  stats.total++
  if (pick.status === 'won') stats.won++
  else if (pick.status === 'lost') stats.lost++
  else if (pick.status === 'pending') stats.pending++
  stats.points += Number(pick.points || 0)
}

const ranking = [...statsByUser.values()].sort((a, b) => b.points - a.points)

const authValues = profiles
  .map(profile => `(${sqlString(profile.user_id)}::uuid, ${sqlString(profile.email)})`)
  .join(',\n    ')

const profileValues = profiles
  .map(profile => `(
    ${sqlString(profile.id)}::uuid,
    ${sqlString(profile.user_id)}::uuid,
    ${sqlString(profile.email)},
    ${sqlString(profile.username)},
    ${sqlString(profile.avatar_url)},
    ${sqlString(profile.bio)},
    ${sqlString(profile.plan || 'free')},
    ${sqlString(profile.role || 'user')},
    ${sqlBool(profile.premium_forever)},
    ${profile.premium_until ? `${sqlString(profile.premium_until)}::timestamptz` : 'null'},
    ${sqlNumeric(profile.daily_generations_used, '0')},
    ${profile.last_generation_reset ? `${sqlString(profile.last_generation_reset)}::date` : 'null'},
    ${sqlNumeric(profile.personal_limit_amount)},
    ${sqlBool(profile.responsible_mode_enabled || 'true')},
    ${profile.created_at ? `${sqlString(profile.created_at)}::timestamptz` : 'now()'},
    ${profile.updated_at ? `${sqlString(profile.updated_at)}::timestamptz` : 'now()'}
  )`)
  .join(',\n')

const pickValues = picks
  .map(pick => `(
    ${sqlString(pick.id)}::uuid,
    ${sqlString(pick.user_id)}::uuid,
    ${sqlString(pick.description)},
    ${sqlString(pick.competition)},
    ${pick.match_date ? `${sqlString(pick.match_date)}::timestamptz` : 'null'},
    ${sqlString(pick.selection)},
    ${sqlNumeric(pick.odds, '1')},
    ${sqlNumeric(pick.stake, '1')},
    ${sqlString(pick.status || 'pending')},
    ${sqlNumeric(pick.profit)},
    ${pick.resolved_at ? `${sqlString(pick.resolved_at)}::timestamptz` : 'null'},
    ${sqlString(pick.note)},
    ${pick.created_at ? `${sqlString(pick.created_at)}::timestamptz` : 'now()'},
    ${sqlJson(pick.legs)},
    ${sqlNumeric(pick.points, '0')}
  )`)
  .join(',\n')

const sql = `-- Legacy Gananesbets import generated from imports/old_profiles.csv and imports/old_picks.csv.
-- Run this in the NEW Supabase SQL Editor only after all schema migrations are applied.
-- This script preserves old user_id values, so matching auth.users rows must already exist.

begin;

do $$
begin
  if exists (
    select 1
    from (values
      ${authValues}
    ) as legacy_users(user_id, email)
    left join auth.users au on au.id = legacy_users.user_id
    where au.id is null
  ) then
    raise exception 'Missing auth.users rows. Import or recreate Auth users first, preserving old user_id values, then rerun this script.';
  end if;
end $$;

insert into public.profiles (
  id,
  user_id,
  email,
  username,
  avatar_url,
  bio,
  plan,
  role,
  premium_forever,
  premium_until,
  daily_generations_used,
  last_generation_reset,
  personal_limit_amount,
  responsible_mode_enabled,
  created_at,
  updated_at
) values
${profileValues}
on conflict (user_id) do update set
  email = excluded.email,
  username = excluded.username,
  avatar_url = excluded.avatar_url,
  bio = excluded.bio,
  plan = excluded.plan,
  role = excluded.role,
  premium_forever = excluded.premium_forever,
  premium_until = excluded.premium_until,
  daily_generations_used = excluded.daily_generations_used,
  last_generation_reset = excluded.last_generation_reset,
  personal_limit_amount = excluded.personal_limit_amount,
  responsible_mode_enabled = excluded.responsible_mode_enabled,
  updated_at = excluded.updated_at;

insert into public.picks (
  id,
  user_id,
  description,
  competition,
  match_date,
  selection,
  odds,
  stake,
  status,
  profit,
  resolved_at,
  note,
  created_at,
  legs,
  points
) values
${pickValues}
on conflict (id) do update set
  user_id = excluded.user_id,
  description = excluded.description,
  competition = excluded.competition,
  match_date = excluded.match_date,
  selection = excluded.selection,
  odds = excluded.odds,
  stake = excluded.stake,
  status = excluded.status,
  profit = excluded.profit,
  resolved_at = excluded.resolved_at,
  note = excluded.note,
  created_at = excluded.created_at,
  legs = excluded.legs,
  points = excluded.points;

commit;

select
  username,
  total_points,
  total_resolved,
  total_won,
  total_pending,
  win_rate
from public.leaderboard
order by total_points desc;
`

const report = `# Legacy Import Report

- Profiles: ${profiles.length}
- Picks: ${picks.length}
- Picks with missing profile: ${missingUserPicks}

## Expected Ranking

| # | Username | Email | Picks | Won | Lost | Pending | Points |
|---:|---|---|---:|---:|---:|---:|---:|
${ranking
  .map((user, index) => `| ${index + 1} | ${user.username || ''} | ${user.email || ''} | ${user.total} | ${user.won} | ${user.lost} | ${user.pending} | ${Math.round(user.points * 100) / 100} |`)
  .join('\n')}

## Important

The generated SQL imports \`profiles\` and \`picks\`, but it intentionally checks that matching \`auth.users.id\` rows exist first.
If those Auth users are missing in the new Supabase project, import or recreate Auth users before running \`imports/import_legacy_profiles_picks.sql\`.
`

fs.writeFileSync(path.join(importsDir, 'import_legacy_profiles_picks.sql'), sql)
fs.writeFileSync(path.join(importsDir, 'migration-report.md'), report)

console.log(`Generated imports/import_legacy_profiles_picks.sql`)
console.log(`Generated imports/migration-report.md`)
