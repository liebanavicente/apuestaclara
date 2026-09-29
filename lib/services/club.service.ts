import { Redis } from '@upstash/redis'
import fs from 'fs'
import path from 'path'
import { getCompletedMatches, getMatchResult, FEATURED_SPORTS } from './odds.service'

export interface Friend {
  id: string
  name: string
  avatarEmoji: string
  pin?: string // optional 4-digit pin
  createdAt: string
}

export interface FriendPick {
  id: string
  friendId: string
  friendName: string
  description: string     // "Real Madrid vs Sevilla"
  competition: string     // "La Liga" | "Champions League"
  selection: string       // "Real Madrid gana" | "Empate" | ...
  odds: number
  matchDate?: string
  status: 'pending' | 'won' | 'lost' | 'void'
  points: number          // odds if won, 0 if lost/pending
  createdAt: string
  resolvedAt?: string
}

export interface LeaderboardPlayer {
  id: string
  name: string
  avatarEmoji: string
  totalPoints: number
  totalResolved: number
  totalWon: number
  totalPending: number
  winRate: number
  currentStreak: number
}

// Key names
const KEY_FRIENDS = 'gb:friends'
const KEY_PICKS = 'gb:picks'

// Redis client initialization (singleton)
let cachedRedis: Redis | null | undefined

function getRedisClient(): Redis | null {
  if (cachedRedis !== undefined) {
    return cachedRedis
  }

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token) {
    try {
      cachedRedis = new Redis({ url, token })
      console.log('[ClubService] Initialized Upstash Redis / Vercel KV client')
      return cachedRedis
    } catch (err) {
      console.error('[ClubService] Failed to create Redis client:', err)
      cachedRedis = null
      return null
    }
  }

  console.warn('[ClubService] KV_REST_API_URL / KV_REST_API_TOKEN not found. Using local fallback.')
  cachedRedis = null
  return null
}

function parseJsonSafe<T>(val: any): T | null {
  if (!val) return null
  if (typeof val === 'string') {
    try {
      return JSON.parse(val) as T
    } catch {
      return null
    }
  }
  return val as T
}

// Local fallback storage for dev / testing if Vercel KV not yet linked
interface LocalStore {
  friends: Record<string, Friend>
  picks: Record<string, FriendPick>
}

const LOCAL_STORE_FILE = path.join(process.cwd(), '.data', 'club.json')

function readLocalStore(): LocalStore {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const raw = fs.readFileSync(LOCAL_STORE_FILE, 'utf8')
      return JSON.parse(raw)
    }
  } catch {
    // ignore
  }
  return { friends: {}, picks: {} }
}

function writeLocalStore(store: LocalStore) {
  try {
    const dir = path.dirname(LOCAL_STORE_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(store, null, 2), 'utf8')
  } catch {
    // ignore
  }
}

// --- Friend Operations ---

export async function getFriends(): Promise<Friend[]> {
  const redis = getRedisClient()
  if (redis) {
    try {
      const data = await redis.hgetall<Record<string, any>>(KEY_FRIENDS)
      if (data && typeof data === 'object') {
        const list: Friend[] = []
        for (const val of Object.values(data)) {
          const item = parseJsonSafe<Friend>(val)
          if (item && item.id && item.name) {
            list.push(item)
          }
        }
        return list.sort((a, b) => a.name.localeCompare(b.name, 'es'))
      }
      return []
    } catch (err) {
      console.error('[ClubService] Error fetching friends from Redis:', err)
    }
  }

  const local = readLocalStore()
  return Object.values(local.friends).sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export async function getFriend(id: string): Promise<Friend | null> {
  const redis = getRedisClient()
  if (redis) {
    try {
      const raw = await redis.hget<any>(KEY_FRIENDS, id)
      const friend = parseJsonSafe<Friend>(raw)
      if (friend) return friend
    } catch (err) {
      console.error('[ClubService] Error getting friend from Redis:', err)
    }
  }
  const local = readLocalStore()
  return local.friends[id] ?? null
}

const DEFAULT_EMOJIS = ['🐟', '🍺', '👑', '⚽', '🎯', '🔥', '🚀', '🥊', '🏆', '🎩', '🦁', '🦊']

export async function createFriend(name: string, avatarEmoji?: string, pin?: string): Promise<Friend> {
  const cleanName = name.trim()
  const id = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.random().toString(36).substring(2, 6)
  const emoji = avatarEmoji?.trim() || DEFAULT_EMOJIS[Math.floor(Math.random() * DEFAULT_EMOJIS.length)]
  const friend: Friend = {
    id,
    name: cleanName,
    avatarEmoji: emoji,
    pin: pin?.trim() || undefined,
    createdAt: new Date().toISOString(),
  }

  const redis = getRedisClient()
  if (redis) {
    try {
      await redis.hset(KEY_FRIENDS, { [id]: friend })
      console.log(`[ClubService] Created friend ${id} (${cleanName}) in Redis KV`)
      return friend
    } catch (err) {
      console.error('[ClubService] Error saving friend to Redis:', err)
      throw new Error('No se pudo guardar el amigo en la base de datos')
    }
  }

  const local = readLocalStore()
  local.friends[id] = friend
  writeLocalStore(local)
  console.log(`[ClubService] Created friend ${id} (${cleanName}) in local store`)
  return friend
}

// --- Pick Operations ---

export async function getPicks(friendId?: string): Promise<FriendPick[]> {
  const redis = getRedisClient()
  let picks: FriendPick[] = []
  if (redis) {
    try {
      const data = await redis.hgetall<Record<string, any>>(KEY_PICKS)
      if (data && typeof data === 'object') {
        const list: FriendPick[] = []
        for (const val of Object.values(data)) {
          const item = parseJsonSafe<FriendPick>(val)
          if (item && item.id && item.friendId) {
            list.push(item)
          }
        }
        picks = list
      }
    } catch (err) {
      console.error('[ClubService] Error fetching picks from Redis:', err)
    }
  } else {
    const local = readLocalStore()
    picks = Object.values(local.picks)
  }

  if (friendId) {
    picks = picks.filter(p => p.friendId === friendId)
  }

  return picks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export interface CreatePickInput {
  description: string
  competition: string
  selection: string
  odds: number
  matchDate?: string
}

export async function createPick(friendId: string, input: CreatePickInput): Promise<{ pick?: FriendPick; error?: string }> {
  const friend = await getFriend(friendId)
  if (!friend) {
    return { error: 'Amigo no encontrado. Selecciona tu perfil primero.' }
  }

  if (input.odds <= 1) {
    return { error: 'La cuota debe ser mayor de 1.00' }
  }

  // Allowed competitions
  const allowed = ['la liga', 'laliga', 'champions league', 'soccer_spain_la_liga', 'soccer_uefa_champs_league']
  const compLower = (input.competition || '').toLowerCase()
  if (input.competition && !allowed.some(c => compLower.includes(c))) {
    return { error: 'Solo se permiten partidos de LaLiga y Champions League' }
  }

  // Check unique pick: one pick per user per match
  const allUserPicks = await getPicks(friendId)
  const alreadyPicked = allUserPicks.find(p => p.description === input.description && p.status !== 'void')
  if (alreadyPicked) {
    return { error: 'Ya tienes un pronóstico registrado para este partido' }
  }

  const id = `pick_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  const pick: FriendPick = {
    id,
    friendId,
    friendName: friend.name,
    description: input.description,
    competition: input.competition || 'La Liga',
    selection: input.selection,
    odds: Math.round(input.odds * 100) / 100,
    matchDate: input.matchDate,
    status: 'pending',
    points: 0,
    createdAt: new Date().toISOString(),
  }

  const redis = getRedisClient()
  if (redis) {
    try {
      await redis.hset(KEY_PICKS, { [id]: pick })
      return { pick }
    } catch (err) {
      console.error('[ClubService] Error creating pick in Redis:', err)
    }
  }

  const local = readLocalStore()
  local.picks[id] = pick
  writeLocalStore(local)
  return { pick }
}

export async function deletePick(id: string, friendId: string): Promise<boolean> {
  const redis = getRedisClient()
  if (redis) {
    try {
      const raw = await redis.hget<any>(KEY_PICKS, id)
      const pick = parseJsonSafe<FriendPick>(raw)
      if (pick && pick.friendId === friendId && pick.status === 'pending') {
        await redis.hdel(KEY_PICKS, id)
        return true
      }
      return false
    } catch (err) {
      console.error('[ClubService] Error deleting pick in Redis:', err)
      return false
    }
  }

  const local = readLocalStore()
  const pick = local.picks[id]
  if (pick && pick.friendId === friendId && pick.status === 'pending') {
    delete local.picks[id]
    writeLocalStore(local)
    return true
  }
  return false
}

export async function resolvePick(id: string, status: 'won' | 'lost'): Promise<boolean> {
  const redis = getRedisClient()
  let pick: FriendPick | null = null

  if (redis) {
    const raw = await redis.hget<any>(KEY_PICKS, id)
    pick = parseJsonSafe<FriendPick>(raw)
  } else {
    const local = readLocalStore()
    pick = local.picks[id] ?? null
  }

  if (!pick) return false

  const points = status === 'won' ? pick.odds : 0
  const updated: FriendPick = {
    ...pick,
    status,
    points: Math.round(points * 100) / 100,
    resolvedAt: new Date().toISOString(),
  }

  if (redis) {
    await redis.hset(KEY_PICKS, { [id]: updated })
    return true
  }

  const local = readLocalStore()
  local.picks[id] = updated
  writeLocalStore(local)
  return true
}

// Auto resolve using The Odds API
export async function autoResolvePendingPicks(): Promise<{ resolved: number; failed: number; log: string[] }> {
  const allPicks = await getPicks()
  const pending = allPicks.filter(p => p.status === 'pending')
  if (pending.length === 0) {
    return { resolved: 0, failed: 0, log: ['No pending picks to resolve'] }
  }

  const sportKeys = FEATURED_SPORTS.map(s => s.key)
  let resolved = 0
  let failed = 0
  const log: string[] = []

  for (const sportKey of sportKeys) {
    const completed = await getCompletedMatches(sportKey, 4)

    for (const match of completed) {
      const result = getMatchResult(match)
      if (!result) continue

      const eventName = `${match.home_team} vs ${match.away_team}`
      const matchPicks = pending.filter(p => p.description.toLowerCase() === eventName.toLowerCase())

      if (matchPicks.length === 0) continue
      log.push(`${eventName}: resultado=${result}, picks=${matchPicks.length}`)

      for (const pick of matchPicks) {
        const sel = pick.selection.toLowerCase()
        let won = false
        if (result === 'home' && sel.includes(match.home_team.toLowerCase())) won = true
        if (result === 'away' && sel.includes(match.away_team.toLowerCase())) won = true
        if (result === 'draw' && sel.includes('empate')) won = true

        const ok = await resolvePick(pick.id, won ? 'won' : 'lost')
        if (ok) resolved++
        else failed++
      }
    }
  }

  return { resolved, failed, log }
}

// Leaderboard calculation
export async function getLeaderboard(): Promise<LeaderboardPlayer[]> {
  const [friends, picks] = await Promise.all([getFriends(), getPicks()])

  const picksByFriend = new Map<string, FriendPick[]>()
  for (const pick of picks) {
    if (!picksByFriend.has(pick.friendId)) picksByFriend.set(pick.friendId, [])
    picksByFriend.get(pick.friendId)!.push(pick)
  }

  const leaderboard: LeaderboardPlayer[] = friends.map(friend => {
    const fPicks = picksByFriend.get(friend.id) ?? []
    const resolved = fPicks.filter(p => p.status === 'won' || p.status === 'lost')
    const won = resolved.filter(p => p.status === 'won')
    const pending = fPicks.filter(p => p.status === 'pending')

    const totalPoints = won.reduce((sum, p) => sum + (p.points || 0), 0)
    const winRate = resolved.length > 0 ? Math.round((won.length / resolved.length) * 1000) / 10 : 0

    // Streak calculation
    let currentStreak = 0
    const sortedResolved = [...resolved].sort((a, b) => (b.resolvedAt || b.createdAt).localeCompare(a.resolvedAt || a.createdAt))
    for (const p of sortedResolved) {
      if (p.status === 'won') currentStreak++
      else break
    }

    return {
      id: friend.id,
      name: friend.name,
      avatarEmoji: friend.avatarEmoji,
      totalPoints: Math.round(totalPoints * 100) / 100,
      totalResolved: resolved.length,
      totalWon: won.length,
      totalPending: pending.length,
      winRate,
      currentStreak,
    }
  })

  // Sort by points descending, tie-break by winRate
  return leaderboard.sort((a, b) => b.totalPoints - a.totalPoints || b.winRate - a.winRate)
}
