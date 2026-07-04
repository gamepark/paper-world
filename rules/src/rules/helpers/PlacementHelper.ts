import { MaterialItem } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapeValue, Landscape } from '../../material/Landscape'
import { LocationType } from '../../material/LocationType'

export function getTopCard(x: number, y: number, panorama: MaterialItem[]): MaterialItem | undefined {
  const stack = panorama.filter(item => item.location.x === x && item.location.y === y)
  if (stack.length === 0) return undefined
  return stack.reduce((top, item) => ((item.location.id ?? 0) > (top.location.id ?? 0) ? item : top))
}

export function getStackHeight(x: number, y: number, panorama: MaterialItem[]): number {
  return panorama.filter(item => item.location.x === x && item.location.y === y).length
}

export function getOccupiedPositions(panorama: MaterialItem[]): Set<string> {
  const positions = new Set<string>()
  for (const item of panorama) {
    positions.add(`${item.location.x},${item.location.y}`)
  }
  return positions
}

export function getValidSpots(cardId: Landscape, panorama: MaterialItem[], blockedPositions: Set<string> = new Set(), maxSkip = 0): [number, number][] {
  const cardColor = getLandscapeColor(cardId)
  const cardValue = getLandscapeValue(cardId)
  const occupied = getOccupiedPositions(panorama)
  const validSpots: [number, number][] = []

  // Check all occupied positions (stack on existing pile)
  for (const key of occupied) {
    if (blockedPositions.has(key)) continue
    const [px, py] = key.split(',').map(Number)
    const top = getTopCard(px, py, panorama)
    if (!top) continue
    const topColor = getLandscapeColor(top.id as Landscape)
    const topValue = getLandscapeValue(top.id as Landscape)
    if (cardColor !== topColor) continue
    const skipLevel = cardValue - topValue - 1
    if (skipLevel >= 0 && skipLevel <= maxSkip) {
      validSpots.push([px, py])
    }
  }

  // Check adjacent empty positions (new stack: value 1, or value 1+skipLevel with a skip)
  const emptySkipLevel = cardValue - 1
  const emptyValueOk = emptySkipLevel >= 0 && emptySkipLevel <= maxSkip
  if (!emptyValueOk) return validSpots
  const xs = panorama.map(item => item.location.x!)
  const ys = panorama.map(item => item.location.y!)
  const xMin = Math.min(...xs)
  const xMax = Math.max(...xs)
  const yMin = Math.min(...ys)
  const yMax = Math.max(...ys)

  // Candidate new positions: adjacent to any occupied cell, within expanded 3x3
  const candidates = new Set<string>()
  for (const key of occupied) {
    const [px, py] = key.split(',').map(Number)
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][]) {
      const nx = px + dx
      const ny = py + dy
      const k = `${nx},${ny}`
      if (!occupied.has(k)) candidates.add(k)
    }
  }

  for (const key of candidates) {
    const [nx, ny] = key.split(',').map(Number)
    // Bounds check: adding this position must keep 3x3 max
    const newXMin = Math.min(xMin, nx)
    const newXMax = Math.max(xMax, nx)
    const newYMin = Math.min(yMin, ny)
    const newYMax = Math.max(yMax, ny)
    if (newXMax - newXMin < 3 && newYMax - newYMin < 3) {
      validSpots.push([nx, ny])
    }
  }

  return validSpots
}

// Retourne le nombre de valeurs sautées par une pose (0 = pose normale, sans saut).
export function getSkipLevel(cardId: Landscape, x: number, y: number, stackIndex: number, panorama: MaterialItem[]): number {
  const cardValue = getLandscapeValue(cardId)
  if (stackIndex === 0) {
    return Math.max(0, cardValue - 1)  // emplacement vide: la pose normale y est un 1
  }
  const prevTop = panorama.find(item =>
    item.location.x === x && item.location.y === y && (item.location.id ?? 0) === stackIndex - 1
  )
  if (!prevTop) return 0
  return Math.max(0, cardValue - getLandscapeValue(prevTop.id as Landscape) - 1)
}

// Mode Avancé: le nombre de rangs sautables est plafonné par ce que le joueur pourra payer
// après avoir posé sa carte (cartes restant en main + 1 carte offerte par le jeton Ciseaux
// si possédé et sa réduction pas encore utilisée ce tour-ci). Le paiement se fait par
// défausse forcée juste après la pose, et non par défausse préalable.
export function getAdvancedJumpBudget(handSize: number, hasToken: boolean, discountUsed: boolean): number {
  return Math.max(0, (handSize - 1) + (hasToken && !discountUsed ? 1 : 0))
}

export function getPlayerPanorama(material: { location: { type: LocationType; player?: number; x?: number; y?: number; id?: number } }[], player: number): MaterialItem[] {
  return material.filter(item => item.location.type === LocationType.Landscape && item.location.player === player) as MaterialItem[]
}
