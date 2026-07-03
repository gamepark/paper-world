import { OPPONENT_SCALE } from '../locators/PlayerRowLayout'
import { TABLE_X_MAX, TABLE_X_MIN, TABLE_Y_MAX } from '../locators/TableLayout'

// Matches StyledPlayerPanel's own fixed width (see panelPlayerStyle: width: 28em).
const PANEL_BASE_WIDTH = 28

/** The active player's panel never grows past this fraction of its natural (base) size. */
const MAX_OWN_SCALE = 2 / 3

/** Fraction of the available row width actually used by panels; the rest becomes margins. */
const ROW_FILL_RATIO = 0.8

/** Distance (in table em) between the panels row and the bottom edge of the table. */
const PANEL_BOTTOM_MARGIN = 1

/** Opponent panels are boosted a bit relative to the board's own ratio, capped below 1 so the active player stays the biggest. */
const OPPONENT_SCALE_BOOST = 1.25
const MAX_OPPONENT_RELATIVE_SCALE = 0.9

/** How far (in table em) the whole row is shifted to the right, to sit under the visible map. */
const ROW_X_OFFSET = 8

/** The gap right after the active player's panel is this many times bigger than the gaps between opponents (mirrors the landscape row). */
const OWN_GAP_BOOST = 2.5

/** Size ratio of a player's panel relative to the active player's (index 0) panel. */
function getRelativeScale(index: number): number {
  if (index === 0) return 1
  return Math.min(MAX_OPPONENT_RELATIVE_SCALE, OPPONENT_SCALE * OPPONENT_SCALE_BOOST)
}

function getTotalRelativeScale(playerCount: number): number {
  let total = 0
  for (let i = 0; i < playerCount; i++) total += getRelativeScale(i)
  return total
}

/** Shared scale applied to the whole row so it always fits the table width. */
function getRowScale(playerCount: number): number {
  const tableWidth = TABLE_X_MAX - TABLE_X_MIN
  const totalRelativeWidth = PANEL_BASE_WIDTH * getTotalRelativeScale(playerCount)
  const fitScale = (tableWidth * ROW_FILL_RATIO) / totalRelativeWidth
  return Math.min(MAX_OWN_SCALE, fitScale)
}

/**
 * Font-size scale applied to a player's panel. The active player (index 0) is the
 * biggest, up to MAX_OWN_SCALE (never bigger than the panel's own natural/base size);
 * opponents are scaled down further using the same ratio as the rest of the board
 * (see OPPONENT_SCALE). The whole row also shrinks if needed so it fits the table.
 */
export function getPanelScale(index: number, playerCount: number): number {
  return getRowScale(playerCount) * getRelativeScale(index)
}

function getPanelWidth(index: number, playerCount: number): number {
  return PANEL_BASE_WIDTH * getPanelScale(index, playerCount)
}

/**
 * Center-x of a panel in table coordinates. Panels are distributed across the row
 * with a "space-around" strategy: equal margins on both sides of every panel, so
 * they stay evenly spaced across the table width even though their widths differ
 * (the active player's panel is bigger than the others'). The gap right after the
 * active player's panel is widened (OWN_GAP_BOOST), same idea as the landscape row.
 */
export function getPanelX(index: number, playerCount: number): number {
  const tableWidth = TABLE_X_MAX - TABLE_X_MIN
  const widths = Array.from({ length: playerCount }, (_, i) => getPanelWidth(i, playerCount))
  const totalWidth = widths.reduce((a, b) => a + b, 0)
  const hasOwnGap = playerCount >= 2
  // playerCount + 1 base gap slots (before, between each pair, after), plus the extra
  // width taken by boosting the one right after the active player's panel.
  const gap = (tableWidth - totalWidth) / (playerCount + 1.2 + (hasOwnGap ? OWN_GAP_BOOST - 1 : 0))

  let x = TABLE_X_MIN + gap
  for (let i = 0; i < index; i++) {
    const gapAfter = i === 0 && hasOwnGap ? gap * OWN_GAP_BOOST : gap
    x += widths[i] + gapAfter
  }
  return x + widths[index] / 2 + ROW_X_OFFSET
}

/** y of the panels row: near the bottom of the table (unlike ipso, which sits near the top). */
export const PANEL_ROW_Y = TABLE_Y_MAX - PANEL_BOTTOM_MARGIN
