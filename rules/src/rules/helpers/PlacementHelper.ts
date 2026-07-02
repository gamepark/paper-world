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

// Mode Avancé: le crédit de saut disponible est la somme des cartes déjà défaussées ce
// tour-ci et, si le jeton Ciseaux est possédé et sa réduction pas encore utilisée, 1 carte
// supplémentaire offerte par le jeton (réduction de coût, et non saut gratuit comme en mode de base).
export function getAdvancedMaxSkip(pendingDiscards: number, hasToken: boolean, discountUsed: boolean): number {
  return pendingDiscards + (hasToken && !discountUsed ? 1 : 0)
}

// Consomme le crédit de saut utilisé par une pose. Si le crédit défaussé ne suffit pas mais que
// la réduction du jeton Ciseaux comble l'écart, elle est marquée comme utilisée pour le reste du tour.
export function consumeAdvancedSkip(pendingDiscards: number, discountUsed: boolean, skipLevel: number, hasToken: boolean): { pendingDiscards: number; discountUsed: boolean } {
  if (skipLevel === 0) return { pendingDiscards, discountUsed }
  if (skipLevel <= pendingDiscards) return { pendingDiscards: pendingDiscards - skipLevel, discountUsed }
  return { pendingDiscards: 0, discountUsed: discountUsed || hasToken }
}

// Vrai si défausser une carte de plus permettrait de poser une carte de la main sur un
// emplacement qui ne serait pas accessible avec le crédit de saut actuel.
export function advancedDiscardWouldHelp(handItems: MaterialItem[], panorama: MaterialItem[], blocked: Set<string>, maxSkip: number): boolean {
  const seenIds = new Set<number>()
  for (const handItem of handItems) {
    const cardId = handItem.id as Landscape
    if (seenIds.has(cardId)) continue
    seenIds.add(cardId)
    const current = getValidSpots(cardId, panorama, blocked, maxSkip)
    const withOneMore = getValidSpots(cardId, panorama, blocked, maxSkip + 1)
    if (withOneMore.length > current.length) return true
  }
  return false
}

export function getPlayerPanorama(material: { location: { type: LocationType; player?: number; x?: number; y?: number; id?: number } }[], player: number): MaterialItem[] {
  return material.filter(item => item.location.type === LocationType.Landscape && item.location.player === player) as MaterialItem[]
}
