import { TABLE_X_MAX, TABLE_X_MIN } from './TableLayout'

/**
 * Everyone sits on a single row. My own column (relative index 0, see
 * `getRelativePlayerIndex`) is always the biggest one; opponents are smaller
 * and ordered left to right by seat, ending right before my column.
 */

const BIG_WIDTH = 50
const SMALL_WIDTH: Record<number, number> = { 2: 28, 3: 20, 4: 15 }

/** Scale applied to opponents' material (card spacing and visual card size), regardless of player count. */
export const OPPONENT_SCALE = 0.5

/** Left-to-right order of relative player indexes. Fixed for the whole game (no recentering). */
export function getSlotOrder(playerCount: number): number[] {
  const opponents = Array.from({ length: playerCount - 1 }, (_, i) => i + 1)
  return [0, ...opponents]
}

export function getColumnWidth(relativeIndex: number, playerCount: number): number {
  return relativeIndex === 0 ? BIG_WIDTH : SMALL_WIDTH[playerCount]
}

/** Center x of a player's column, using a "space-around" distribution over the (uneven) column widths. */
export function getColumnCenterX(relativeIndex: number, playerCount: number): number {
  const order = getSlotOrder(playerCount)
  const slot = order.indexOf(relativeIndex)
  const widths = order.map((idx) => getColumnWidth(idx, playerCount))
  const total = widths.reduce((sum, w) => sum + w, 0)
  const tableWidth = TABLE_X_MAX - TABLE_X_MIN
  const margin = (tableWidth - total) / (2 * order.length)

  let x = TABLE_X_MIN + margin
  for (let i = 0; i < slot; i++) {
    x += widths[i] + 2 * margin
  }
  return x + widths[slot] / 2
}

/** Common y of the row of landscapes. */
export const ROW_Y = -8

/** y offset (from ROW_Y) of the hand/discard row, for opponents (scaled down further by OPPONENT_SCALE). */
export const HAND_Y_OFFSET = 50

/** y offset (from ROW_Y) of the hand/discard row, for my own (full-size) column — kept low enough to stay clear of the bottom player-panel row. */
export const OWN_HAND_Y_OFFSET = 21

/** y offset (from ROW_Y) of opponents' bonus/scissors tokens — sits below their (shrunk) hand row. */
export const OPPONENT_BONUS_Y_OFFSET = 13
