import { MaterialItem } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapeValue, hasScissors, Landscape, LandscapeColor } from '../../material/Landscape'
import { Objectives } from '../../material/Objectives'
import { getTopCard } from './PlacementHelper'

type CardInfo = { color: LandscapeColor; value: number; scissors: boolean }
type PanoramaMap = Map<string, CardInfo>

function k(x: number, y: number): string {
  return `${x},${y}`
}

function buildPanoramaMap(panorama: MaterialItem[]): PanoramaMap {
  const positions = new Set(panorama.map(item => k(item.location.x!, item.location.y!)))
  const map = new Map<string, CardInfo>()
  for (const pos of positions) {
    const [x, y] = pos.split(',').map(Number)
    const top = getTopCard(x, y, panorama)
    if (!top) continue
    map.set(pos, {
      color: getLandscapeColor(top.id as Landscape),
      value: getLandscapeValue(top.id as Landscape),
      scissors: hasScissors(top.id as Landscape)
    })
  }
  return map
}

function positions(map: PanoramaMap): [number, number][] {
  return [...map.keys()].map(p => p.split(',').map(Number) as [number, number])
}

function boundingBox(pos: [number, number][]) {
  const xs = pos.map(p => p[0])
  const ys = pos.map(p => p[1])
  return { xMin: Math.min(...xs), xMax: Math.max(...xs), yMin: Math.min(...ys), yMax: Math.max(...ys) }
}

// L-tromino : coin + un bras horizontal + un bras vertical (4 orientations)
function checkLShape(map: PanoramaMap, pred: (corner: CardInfo, h: CardInfo, v: CardInfo) => boolean): boolean {
  for (const [cx, cy] of positions(map)) {
    const corner = map.get(k(cx, cy))!
    for (const dx of [-1, 1]) {
      for (const dy of [-1, 1]) {
        const h = map.get(k(cx + dx, cy))
        const v = map.get(k(cx, cy + dy))
        if (h && v && pred(corner, h, v)) return true
      }
    }
  }
  return false
}

// Carré 2×2 (le coin passé est le haut-gauche)
function checkSquare(map: PanoramaMap, pred: (cards: CardInfo[]) => boolean): boolean {
  for (const [x, y] of positions(map)) {
    const keys = [k(x, y), k(x + 1, y), k(x, y + 1), k(x + 1, y + 1)]
    if (!keys.every(key => map.has(key))) continue
    if (pred(keys.map(key => map.get(key)!))) return true
  }
  return false
}

// Croix + : centre + 4 bras adjacents
function checkCross(map: PanoramaMap, pred: (center: CardInfo, arms: CardInfo[]) => boolean): boolean {
  for (const [cx, cy] of positions(map)) {
    const armKeys = [k(cx, cy - 1), k(cx - 1, cy), k(cx + 1, cy), k(cx, cy + 1)]
    if (!armKeys.every(key => map.has(key))) continue
    const center = map.get(k(cx, cy))!
    const arms = armKeys.map(key => map.get(key)!)
    if (pred(center, arms)) return true
  }
  return false
}

// Les deux diagonales du bounding box 3×3 (uniquement si box = 3×3)
function getDiagonals(map: PanoramaMap): CardInfo[][] {
  const pos = positions(map)
  if (pos.length === 0) return []
  const { xMin, xMax, yMin, yMax } = boundingBox(pos)
  if (xMax - xMin !== 2 || yMax - yMin !== 2) return []
  const xMid = xMin + 1, yMid = yMin + 1
  const d1 = [k(xMin, yMin), k(xMid, yMid), k(xMax, yMax)]
  const d2 = [k(xMax, yMin), k(xMid, yMid), k(xMin, yMax)]
  const result: CardInfo[][] = []
  if (d1.every(key => map.has(key))) result.push(d1.map(key => map.get(key)!))
  if (d2.every(key => map.has(key))) result.push(d2.map(key => map.get(key)!))
  return result
}

// Lignes complètes : même y, 3 cellules sur toute la largeur (xMax - xMin = 2)
function completeRows(map: PanoramaMap): CardInfo[][] {
  const pos = positions(map)
  if (pos.length === 0) return []
  const { xMin, xMax, yMin, yMax } = boundingBox(pos)
  if (xMax - xMin !== 2) return []
  const rows: CardInfo[][] = []
  for (let y = yMin; y <= yMax; y++) {
    const keys = [k(xMin, y), k(xMin + 1, y), k(xMin + 2, y)]
    if (keys.every(key => map.has(key))) rows.push(keys.map(key => map.get(key)!))
  }
  return rows
}

// Colonnes complètes : même x, 3 cellules sur toute la hauteur (yMax - yMin = 2)
// Triées par y croissant (= haut vers bas à l'écran)
function completeColumns(map: PanoramaMap): CardInfo[][] {
  const pos = positions(map)
  if (pos.length === 0) return []
  const { xMin, xMax, yMin, yMax } = boundingBox(pos)
  if (yMax - yMin !== 2) return []
  const cols: CardInfo[][] = []
  for (let x = xMin; x <= xMax; x++) {
    const keys = [k(x, yMin), k(x, yMin + 1), k(x, yMin + 2)]
    if (keys.every(key => map.has(key))) cols.push(keys.map(key => map.get(key)!))
  }
  return cols
}

function stackHeight(x: number, y: number, panorama: MaterialItem[]): number {
  return panorama.filter(item => item.location.x === x && item.location.y === y).length
}

export function isObjectiveCompleted(objective: Objectives, panorama: MaterialItem[]): boolean {
  const map = buildPanoramaMap(panorama)

  switch (objective) {
    case Objectives.LOfSameColor:
      return checkLShape(map, (c, h, v) => h.color === c.color && v.color === c.color)

    case Objectives.FourCornersWithTheSameValue: {
      const pos = positions(map)
      if (pos.length === 0) return false
      const { xMin, xMax, yMin, yMax } = boundingBox(pos)
      if (xMax - xMin !== 2 || yMax - yMin !== 2) return false
      const corners = [k(xMin, yMin), k(xMax, yMin), k(xMin, yMax), k(xMax, yMax)]
      if (!corners.every(key => map.has(key))) return false
      const vals = corners.map(key => map.get(key)!.value)
      return vals.every(v => v === vals[0])
    }

    case Objectives.LOf2s:
      return checkLShape(map, (c, h, v) => c.value === 2 && h.value === 2 && v.value === 2)

    case Objectives.SquareOfDifferentColors:
      return checkSquare(map, cards => new Set(cards.map(c => c.color)).size === 4)

    case Objectives.NineStacks: {
      const pos = positions(map)
      const { xMin, xMax, yMin, yMax } = boundingBox(pos)
      if (xMax - xMin !== 2 || yMax - yMin !== 2) return false
      for (let x = xMin; x <= xMax; x++)
        for (let y = yMin; y <= yMax; y++)
          if (!map.has(k(x, y))) return false
      return true
    }

    case Objectives.OneDiagonalOfSameColor:
      return getDiagonals(map).some(diag => diag.every(c => c.color === diag[0].color))

    case Objectives.OneLineOf3s:
      return [...completeRows(map), ...completeColumns(map)].some(line => line.every(c => c.value === 3))

    case Objectives.TwoStacksOf5s:
      return [...map.values()].filter(c => c.value === 5).length >= 2

    case Objectives.OneTwoThreeFourFiveVisible: {
      const vals = new Set([...map.values()].map(c => c.value))
      return [1, 2, 3, 4, 5].every(v => vals.has(v))
    }

    case Objectives.OneColumnWith252:
      return completeColumns(map).some(col => col[0].value === 2 && col[1].value === 5 && col[2].value === 2)

    case Objectives.OneDiagonalWith234:
      return getDiagonals(map).some(diag => {
        const [v0, v1, v2] = diag.map(c => c.value)
        return (v0 === 2 && v1 === 3 && v2 === 4) || (v0 === 4 && v1 === 3 && v2 === 2)
      })

    case Objectives.ThreeStacksOf4s:
      return positions(map).filter(([x, y]) => stackHeight(x, y, panorama) >= 4).length >= 3

    case Objectives.FiveStacksOf1s:
      return [...map.values()].filter(c => c.value === 1).length >= 5

    case Objectives.OneLineWithValueOf9:
      return completeRows(map).some(row => row.reduce((s, c) => s + c.value, 0) === 9)

    case Objectives.OneColumnWithValueOf12:
      return completeColumns(map).some(col => col.reduce((s, c) => s + c.value, 0) === 12)

    case Objectives.ThreeStacksWithScissors:
      return [...map.values()].filter(c => c.scissors).length >= 3

    case Objectives.SquareOf3:
      return checkSquare(map, cards => cards.every(c => c.value === 3))

    case Objectives.SquareOfSameColor:
      return checkSquare(map, cards => cards.every(c => c.color === cards[0].color))

    case Objectives.CrossOfDifferentValues:
      return checkCross(map, (center, arms) => new Set([center, ...arms].map(c => c.value)).size === 5)

    case Objectives.CrossOfDifferentColors:
      return checkCross(map, (_center, arms) => new Set(arms.map(c => c.color)).size === 4)
  }
}
