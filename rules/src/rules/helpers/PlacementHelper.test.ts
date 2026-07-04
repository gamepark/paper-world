import { MaterialItem } from '@gamepark/rules-api'
import { describe, expect, it } from 'vitest'
import { Landscape } from '../../material/Landscape'
import { LocationType } from '../../material/LocationType'
import { getAdvancedJumpBudget, getSkipLevel, getValidSpots } from './PlacementHelper'

const Y1 = Landscape.Yellow1
const Y2 = Landscape.Yellow2
const Y3 = Landscape.Yellow3
const Y4 = Landscape.Yellow4
const Y5 = Landscape.Yellow5
const B1 = Landscape.Blue1

function card(id: Landscape, x: number, y: number, stackIdx = 0): MaterialItem {
  return { id, location: { type: LocationType.Landscape, player: 1, x, y, id: stackIdx } } as MaterialItem
}

describe('getValidSpots — stacking on an existing pile', () => {
  it('allows the normal next value with maxSkip 0', () => {
    const panorama = [card(Y1, 0, 0)]
    expect(getValidSpots(Y2, panorama, new Set(), 0)).toContainEqual([0, 0])
    expect(getValidSpots(Y3, panorama, new Set(), 0)).not.toContainEqual([0, 0])
  })

  it('rejects a gap bigger than maxSkip', () => {
    const panorama = [card(Y1, 0, 0)]
    expect(getValidSpots(Y4, panorama, new Set(), 1)).not.toContainEqual([0, 0]) // gap of 2 > maxSkip 1
    expect(getValidSpots(Y4, panorama, new Set(), 2)).toContainEqual([0, 0]) // gap of 2 <= maxSkip 2
  })

  it('allows a skip of exactly maxSkip (advanced multi-card jump)', () => {
    const panorama = [card(Y1, 0, 0)]
    // Y1 posé, poser directement Y5 saute Y2/Y3/Y4 (gap de 3)
    expect(getValidSpots(Y5, panorama, new Set(), 3)).toContainEqual([0, 0])
    expect(getValidSpots(Y5, panorama, new Set(), 2)).not.toContainEqual([0, 0])
  })

  it('never allows a different color, regardless of maxSkip', () => {
    const panorama = [card(Y1, 0, 0)]
    expect(getValidSpots(B1, panorama, new Set(), 5)).not.toContainEqual([0, 0])
  })

  it('respects blocked positions regardless of maxSkip', () => {
    const panorama = [card(Y1, 0, 0)]
    expect(getValidSpots(Y2, panorama, new Set(['0,0']), 3)).not.toContainEqual([0, 0])
  })
})

describe('getValidSpots — starting a new stack on an empty spot', () => {
  it('allows value 1 with maxSkip 0', () => {
    const panorama = [card(Y1, 0, 0)]
    expect(getValidSpots(Y1, panorama, new Set(), 0)).toContainEqual([1, 0])
  })

  it('requires maxSkip >= value - 1 to start higher than 1', () => {
    const panorama = [card(Y1, 0, 0)]
    expect(getValidSpots(Y3, panorama, new Set(), 1)).not.toContainEqual([1, 0]) // needs skip 2
    expect(getValidSpots(Y3, panorama, new Set(), 2)).toContainEqual([1, 0])
  })
})

describe('getSkipLevel', () => {
  const panorama = [card(Y1, 0, 0)]

  it('is 0 for a normal placement on an existing pile', () => {
    expect(getSkipLevel(Y2, 0, 0, 1, panorama)).toBe(0)
  })

  it('is the number of skipped values on an existing pile', () => {
    expect(getSkipLevel(Y4, 0, 0, 1, panorama)).toBe(2)
  })

  it('is 0 for a normal placement (value 1) on an empty spot', () => {
    expect(getSkipLevel(Y1, 1, 0, 0, panorama)).toBe(0)
  })

  it('is value - 1 on an empty spot', () => {
    expect(getSkipLevel(Y4, 1, 0, 0, panorama)).toBe(3)
  })
})

describe('getAdvancedJumpBudget', () => {
  it('equals the remaining hand size after playing the jump card, with no token', () => {
    expect(getAdvancedJumpBudget(3, false, false)).toBe(2)
  })

  it('adds 1 credit when the token is held and its discount is unused', () => {
    expect(getAdvancedJumpBudget(3, true, false)).toBe(3)
  })

  it('does not add a credit once the discount has been used this turn', () => {
    expect(getAdvancedJumpBudget(3, true, true)).toBe(2)
  })

  it('never goes negative when the hand is empty', () => {
    expect(getAdvancedJumpBudget(0, false, false)).toBe(0)
  })
})
