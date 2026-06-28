import { MaterialItem } from '@gamepark/rules-api'
import { describe, expect, it } from 'vitest'
import { Landscape, LandscapeColor } from '../../material/Landscape'
import { LocationType } from '../../material/LocationType'
import { Objectives } from '../../material/Objectives'
import { isObjectiveCompleted } from './ObjectiveHelper'

// Shorthand: color*10 + value → Landscape enum value
// Yellow=1, Blue=2, Green=3, Black=4 | Values 1-5 | Scissors: % 10 > 5
const Y1 = Landscape.Yellow1  // color=1, value=1
const Y2 = Landscape.Yellow2  // color=1, value=2
const Y3 = Landscape.Yellow3  // color=1, value=3
const Y4 = Landscape.Yellow4  // color=1, value=4
const Y5 = Landscape.Yellow5  // color=1, value=5
const YS1 = Landscape.YellowScissors1  // color=1, value=1, scissors
const YS2 = Landscape.YellowScissors2  // color=1, value=2, scissors
const B1 = Landscape.Blue1    // color=2, value=1
const B2 = Landscape.Blue2    // color=2, value=2
const B3 = Landscape.Blue3    // color=2, value=3
const B4 = Landscape.Blue4    // color=2, value=4
const B5 = Landscape.Blue5    // color=2, value=5
const BS1 = Landscape.BlueScissors1   // color=2, value=1, scissors
const G1 = Landscape.Green1   // color=3, value=1
const G2 = Landscape.Green2   // color=3, value=2
const G3 = Landscape.Green3   // color=3, value=3
const G4 = Landscape.Green4   // color=3, value=4
const G5 = Landscape.Green5   // color=3, value=5
const GS1 = Landscape.GreenScissors1  // color=3, value=1, scissors
const K1 = Landscape.Black1   // color=4, value=1
const K2 = Landscape.Black2   // color=4, value=2
const K3 = Landscape.Black3   // color=4, value=3
const K4 = Landscape.Black4   // color=4, value=4
const K5 = Landscape.Black5   // color=4, value=5
const KS1 = Landscape.BlackScissors1  // color=4, value=1, scissors

function card(id: Landscape, x: number, y: number, stackIdx = 0): MaterialItem {
  return { id, location: { type: LocationType.Landscape, player: 1, x, y, id: stackIdx } } as MaterialItem
}

// Build a stack: multiple cards at the same (x,y)
function stack(...ids: Landscape[]): (x: number, y: number) => MaterialItem[] {
  return (x, y) => ids.map((id, i) => card(id, x, y, i))
}

// ─── 1. LOfSameColor ────────────────────────────────────────────────────────

describe('LOfSameColor', () => {
  it('passes with yellow L-tromino (corner at top-left)', () => {
    // Y Y  →  corner(0,0) + right(1,0) + below(0,1)
    // Y .
    expect(isObjectiveCompleted(Objectives.LOfSameColor, [
      card(Y1, 0, 0), card(Y2, 1, 0), card(Y3, 0, 1)
    ])).toBe(true)
  })

  it('passes with L rotated (corner at bottom-right)', () => {
    // . Y
    // Y Y
    expect(isObjectiveCompleted(Objectives.LOfSameColor, [
      card(B2, 1, 0), card(B1, 0, 1), card(B3, 1, 1)
    ])).toBe(true)
  })

  it('fails when L-shape has mixed colors', () => {
    expect(isObjectiveCompleted(Objectives.LOfSameColor, [
      card(Y1, 0, 0), card(Y2, 1, 0), card(B1, 0, 1)
    ])).toBe(false)
  })

  it('fails when 3 same-color cards are in a straight line (not an L)', () => {
    expect(isObjectiveCompleted(Objectives.LOfSameColor, [
      card(Y1, 0, 0), card(Y2, 1, 0), card(Y3, 2, 0)
    ])).toBe(false)
  })

  it('fails with only 2 same-color cards', () => {
    expect(isObjectiveCompleted(Objectives.LOfSameColor, [
      card(Y1, 0, 0), card(Y2, 1, 0)
    ])).toBe(false)
  })
})

// ─── 2. FourCornersWithTheSameValue ─────────────────────────────────────────

describe('FourCornersWithTheSameValue', () => {
  it('passes when all 4 corners of 3×3 have value 1', () => {
    expect(isObjectiveCompleted(Objectives.FourCornersWithTheSameValue, [
      card(Y1, 0, 0), card(B1, 2, 0), card(G1, 0, 2), card(K1, 2, 2),
      card(Y2, 1, 0), card(Y3, 1, 1)  // filler to make 3×3 bounding box
    ])).toBe(true)
  })

  it('fails when corners have different values', () => {
    expect(isObjectiveCompleted(Objectives.FourCornersWithTheSameValue, [
      card(Y1, 0, 0), card(B2, 2, 0), card(G1, 0, 2), card(K1, 2, 2),
      card(Y2, 1, 1)
    ])).toBe(false)
  })

  it('fails when bounding box is not 3×3', () => {
    // Only 2 columns wide
    expect(isObjectiveCompleted(Objectives.FourCornersWithTheSameValue, [
      card(Y1, 0, 0), card(B1, 1, 0), card(G1, 0, 2), card(K1, 1, 2)
    ])).toBe(false)
  })

  it('fails when a corner position is empty', () => {
    expect(isObjectiveCompleted(Objectives.FourCornersWithTheSameValue, [
      card(Y1, 0, 0), card(B1, 2, 0), card(G1, 0, 2),
      // missing (2,2)
      card(Y2, 1, 1)
    ])).toBe(false)
  })
})

// ─── 3. LOf2s ────────────────────────────────────────────────────────────────

describe('LOf2s', () => {
  it('passes with L-tromino of 3 cards all value 2', () => {
    expect(isObjectiveCompleted(Objectives.LOf2s, [
      card(Y2, 0, 0), card(B2, 1, 0), card(G2, 0, 1)
    ])).toBe(true)
  })

  it('fails when one card in L has wrong value', () => {
    expect(isObjectiveCompleted(Objectives.LOf2s, [
      card(Y2, 0, 0), card(Y3, 1, 0), card(G2, 0, 1)
    ])).toBe(false)
  })

  it('fails with value-2 cards in a straight line', () => {
    expect(isObjectiveCompleted(Objectives.LOf2s, [
      card(Y2, 0, 0), card(B2, 1, 0), card(G2, 2, 0)
    ])).toBe(false)
  })
})

// ─── 4. SquareOfDifferentColors ──────────────────────────────────────────────

describe('SquareOfDifferentColors', () => {
  it('passes with 2×2 square of 4 different colors', () => {
    expect(isObjectiveCompleted(Objectives.SquareOfDifferentColors, [
      card(Y1, 0, 0), card(B1, 1, 0), card(G1, 0, 1), card(K1, 1, 1)
    ])).toBe(true)
  })

  it('fails when two cards share a color', () => {
    expect(isObjectiveCompleted(Objectives.SquareOfDifferentColors, [
      card(Y1, 0, 0), card(Y2, 1, 0), card(G1, 0, 1), card(K1, 1, 1)
    ])).toBe(false)
  })

  it('fails with only 3 unique colors in 2×2', () => {
    expect(isObjectiveCompleted(Objectives.SquareOfDifferentColors, [
      card(Y1, 0, 0), card(B1, 1, 0), card(G1, 0, 1), card(B2, 1, 1)
    ])).toBe(false)
  })
})

// ─── 5. NineStacks ───────────────────────────────────────────────────────────

describe('NineStacks', () => {
  it('passes when all 9 positions of 3×3 are occupied', () => {
    const cards = []
    for (let x = 0; x < 3; x++)
      for (let y = 0; y < 3; y++)
        cards.push(card(Y1, x, y))
    expect(isObjectiveCompleted(Objectives.NineStacks, cards)).toBe(true)
  })

  it('fails with only 8 positions', () => {
    const cards = []
    for (let x = 0; x < 3; x++)
      for (let y = 0; y < 3; y++)
        if (!(x === 2 && y === 2)) cards.push(card(Y1, x, y))
    expect(isObjectiveCompleted(Objectives.NineStacks, cards)).toBe(false)
  })

  it('fails when bounding box is not 3×3', () => {
    const cards = []
    for (let x = 0; x < 2; x++)
      for (let y = 0; y < 3; y++)
        cards.push(card(Y1, x, y))
    expect(isObjectiveCompleted(Objectives.NineStacks, cards)).toBe(false)
  })
})

// ─── 6. OneDiagonalOfSameColor ───────────────────────────────────────────────

describe('OneDiagonalOfSameColor', () => {
  it('passes with main diagonal (top-left to bottom-right) same color', () => {
    expect(isObjectiveCompleted(Objectives.OneDiagonalOfSameColor, [
      card(Y1, 0, 0), card(Y2, 1, 1), card(Y3, 2, 2),
      card(B1, 2, 0), card(G1, 0, 2)  // filler to complete 3×3 bounding box
    ])).toBe(true)
  })

  it('passes with anti-diagonal (top-right to bottom-left) same color', () => {
    expect(isObjectiveCompleted(Objectives.OneDiagonalOfSameColor, [
      card(B1, 2, 0), card(B2, 1, 1), card(B3, 0, 2),
      card(Y1, 0, 0), card(G1, 2, 2)
    ])).toBe(true)
  })

  it('fails when diagonal colors are mixed', () => {
    expect(isObjectiveCompleted(Objectives.OneDiagonalOfSameColor, [
      card(Y1, 0, 0), card(B2, 1, 1), card(Y3, 2, 2),
      card(G1, 2, 0), card(K1, 0, 2)
    ])).toBe(false)
  })

  it('fails when bounding box is not 3×3', () => {
    expect(isObjectiveCompleted(Objectives.OneDiagonalOfSameColor, [
      card(Y1, 0, 0), card(Y2, 1, 1)
    ])).toBe(false)
  })
})

// ─── 7. OneLineOf3s ──────────────────────────────────────────────────────────

describe('OneLineOf3s', () => {
  it('passes with a complete row (y=0) of value-3 cards', () => {
    expect(isObjectiveCompleted(Objectives.OneLineOf3s, [
      card(Y3, 0, 0), card(G3, 1, 0), card(B3, 2, 0)
    ])).toBe(true)
  })

  it('passes with a complete column (x=1) of value-3 cards', () => {
    expect(isObjectiveCompleted(Objectives.OneLineOf3s, [
      card(Y1, 0, 0), card(Y3, 1, 0), card(Y1, 2, 0),  // filler row
      card(G1, 0, 1), card(G3, 1, 1), card(G1, 2, 1),
      card(B1, 0, 2), card(B3, 1, 2), card(B1, 2, 2)
    ])).toBe(true)
  })

  it('fails when one card in the row has wrong value', () => {
    expect(isObjectiveCompleted(Objectives.OneLineOf3s, [
      card(Y3, 0, 0), card(Y4, 1, 0), card(B3, 2, 0)
    ])).toBe(false)
  })

  it('fails when row is incomplete (bounding box narrower than 3)', () => {
    expect(isObjectiveCompleted(Objectives.OneLineOf3s, [
      card(Y3, 0, 0), card(G3, 1, 0)
    ])).toBe(false)
  })
})

// ─── 8. TwoStacksOf5s ────────────────────────────────────────────────────────

describe('TwoStacksOf5s', () => {
  it('passes with exactly 2 stacks showing value 5', () => {
    expect(isObjectiveCompleted(Objectives.TwoStacksOf5s, [
      card(Y5, 0, 0), card(B5, 1, 0)
    ])).toBe(true)
  })

  it('passes with more than 2 stacks showing value 5', () => {
    expect(isObjectiveCompleted(Objectives.TwoStacksOf5s, [
      card(Y5, 0, 0), card(B5, 1, 0), card(G5, 2, 0)
    ])).toBe(true)
  })

  it('fails with only 1 stack showing value 5', () => {
    expect(isObjectiveCompleted(Objectives.TwoStacksOf5s, [
      card(Y5, 0, 0), card(B4, 1, 0)
    ])).toBe(false)
  })

  it('uses top card of stack, not buried card', () => {
    // Stack at (0,0): Y5 buried under Y4 → visible = Y4 (value 4)
    expect(isObjectiveCompleted(Objectives.TwoStacksOf5s, [
      card(Y5, 0, 0, 0), card(Y4, 0, 0, 1),  // Y4 on top
      card(B5, 1, 0)
    ])).toBe(false)
  })
})

// ─── 9. OneTwoThreeFourFiveVisible ───────────────────────────────────────────

describe('OneTwoThreeFourFiveVisible', () => {
  it('passes when values 1–5 are all visible', () => {
    expect(isObjectiveCompleted(Objectives.OneTwoThreeFourFiveVisible, [
      card(Y1, 0, 0), card(Y2, 1, 0), card(Y3, 2, 0),
      card(B4, 0, 1), card(B5, 1, 1)
    ])).toBe(true)
  })

  it('passes with stacks hiding lower values', () => {
    // (0,0): Y1 buried, Y2 on top → visible = 2; still have 1 elsewhere
    expect(isObjectiveCompleted(Objectives.OneTwoThreeFourFiveVisible, [
      card(Y1, 0, 0, 0), card(Y2, 0, 0, 1),
      card(B1, 1, 0), card(Y3, 2, 0), card(B4, 0, 1), card(G5, 1, 1)
    ])).toBe(true)
  })

  it('fails when one value is missing', () => {
    expect(isObjectiveCompleted(Objectives.OneTwoThreeFourFiveVisible, [
      card(Y1, 0, 0), card(Y2, 1, 0), card(Y3, 2, 0), card(B5, 0, 1)
      // missing value 4
    ])).toBe(false)
  })
})

// ─── 10. OneColumnWith252 ────────────────────────────────────────────────────

describe('OneColumnWith252', () => {
  it('passes with column [2, 5, 2] from top (yMin) to bottom (yMax)', () => {
    expect(isObjectiveCompleted(Objectives.OneColumnWith252, [
      card(Y2, 0, 0), card(Y5, 0, 1), card(B2, 0, 2)
    ])).toBe(true)
  })

  it('fails with column [5, 2, 2] (wrong order)', () => {
    expect(isObjectiveCompleted(Objectives.OneColumnWith252, [
      card(Y5, 0, 0), card(Y2, 0, 1), card(B2, 0, 2)
    ])).toBe(false)
  })

  it('fails with column [2, 2, 5] (wrong order)', () => {
    expect(isObjectiveCompleted(Objectives.OneColumnWith252, [
      card(Y2, 0, 0), card(B2, 0, 1), card(G5, 0, 2)
    ])).toBe(false)
  })

  it('passes when another column satisfies but not all', () => {
    expect(isObjectiveCompleted(Objectives.OneColumnWith252, [
      card(Y1, 0, 0), card(Y3, 0, 1), card(B4, 0, 2),  // col x=0: [1,3,4] ✗
      card(G2, 1, 0), card(G5, 1, 1), card(K2, 1, 2)   // col x=1: [2,5,2] ✓
    ])).toBe(true)
  })

  it('fails when column height is less than 3', () => {
    expect(isObjectiveCompleted(Objectives.OneColumnWith252, [
      card(Y2, 0, 0), card(Y5, 0, 1)  // bounding box height = 2
    ])).toBe(false)
  })
})

// ─── 11. OneDiagonalWith234 ──────────────────────────────────────────────────

describe('OneDiagonalWith234', () => {
  it('passes with main diagonal values 2-3-4 (ascending)', () => {
    expect(isObjectiveCompleted(Objectives.OneDiagonalWith234, [
      card(Y2, 0, 0), card(Y3, 1, 1), card(Y4, 2, 2),
      card(B1, 2, 0), card(G1, 0, 2)
    ])).toBe(true)
  })

  it('passes with anti-diagonal values 4-3-2 (descending)', () => {
    expect(isObjectiveCompleted(Objectives.OneDiagonalWith234, [
      card(Y4, 2, 0), card(B3, 1, 1), card(G2, 0, 2),
      card(K1, 0, 0), card(Y1, 2, 2)
    ])).toBe(true)
  })

  it('fails when diagonal values are {2,3,5} instead of {2,3,4}', () => {
    expect(isObjectiveCompleted(Objectives.OneDiagonalWith234, [
      card(Y2, 0, 0), card(B3, 1, 1), card(G5, 2, 2),
      card(K1, 2, 0), card(Y1, 0, 2)
    ])).toBe(false)
  })

  it('fails when diagonal values are in wrong order [2,4,3]', () => {
    expect(isObjectiveCompleted(Objectives.OneDiagonalWith234, [
      card(Y2, 0, 0), card(B4, 1, 1), card(G3, 2, 2),
      card(K1, 2, 0), card(Y1, 0, 2)
    ])).toBe(false)
  })

  it('fails when bounding box is not 3×3', () => {
    expect(isObjectiveCompleted(Objectives.OneDiagonalWith234, [
      card(Y2, 0, 0), card(Y3, 1, 1)
    ])).toBe(false)
  })
})

// ─── 12. ThreeStacksOf4s ─────────────────────────────────────────────────────

describe('ThreeStacksOf4s', () => {
  it('passes with 3 positions having stack height ≥ 4', () => {
    const panorama = [
      ...stack(Y1, Y2, Y3, Y4)(0, 0),
      ...stack(B1, B2, B3, B4)(1, 0),
      ...stack(G1, G2, G3, G4)(2, 0)
    ]
    expect(isObjectiveCompleted(Objectives.ThreeStacksOf4s, panorama)).toBe(true)
  })

  it('passes when some stacks have more than 4 cards', () => {
    const panorama = [
      ...stack(Y1, Y2, Y3, Y4, Y5)(0, 0),
      ...stack(B1, B2, B3, B4)(1, 0),
      ...stack(G1, G2, G3, G4)(2, 0)
    ]
    expect(isObjectiveCompleted(Objectives.ThreeStacksOf4s, panorama)).toBe(true)
  })

  it('fails with only 2 stacks of height 4', () => {
    const panorama = [
      ...stack(Y1, Y2, Y3, Y4)(0, 0),
      ...stack(B1, B2, B3, B4)(1, 0),
      card(G1, 2, 0)
    ]
    expect(isObjectiveCompleted(Objectives.ThreeStacksOf4s, panorama)).toBe(false)
  })
})

// ─── 13. FiveStacksOf1s ──────────────────────────────────────────────────────

describe('FiveStacksOf1s', () => {
  it('passes with 5 positions showing value 1 on top', () => {
    expect(isObjectiveCompleted(Objectives.FiveStacksOf1s, [
      card(Y1, 0, 0), card(B1, 1, 0), card(G1, 2, 0),
      card(K1, 0, 1), card(Y1, 1, 1)
    ])).toBe(true)
  })

  it('fails with only 4 positions showing value 1', () => {
    expect(isObjectiveCompleted(Objectives.FiveStacksOf1s, [
      card(Y1, 0, 0), card(B1, 1, 0), card(G1, 2, 0),
      card(K1, 0, 1), card(Y2, 1, 1)  // value 2
    ])).toBe(false)
  })

  it('does not count buried value-1 cards', () => {
    // (0,0): Y1 buried under Y2 → top is value 2
    expect(isObjectiveCompleted(Objectives.FiveStacksOf1s, [
      card(Y1, 0, 0, 0), card(Y2, 0, 0, 1),
      card(B1, 1, 0), card(G1, 2, 0), card(K1, 0, 1), card(Y1, 1, 1)
    ])).toBe(false)
  })
})

// ─── 14. OneLineWithValueOf9 ─────────────────────────────────────────────────

describe('OneLineWithValueOf9', () => {
  it('passes with row sum = 9 (3+3+3)', () => {
    expect(isObjectiveCompleted(Objectives.OneLineWithValueOf9, [
      card(Y3, 0, 0), card(B3, 1, 0), card(G3, 2, 0)
    ])).toBe(true)
  })

  it('passes with row sum = 9 (2+3+4)', () => {
    expect(isObjectiveCompleted(Objectives.OneLineWithValueOf9, [
      card(Y2, 0, 0), card(B3, 1, 0), card(G4, 2, 0)
    ])).toBe(true)
  })

  it('passes with row sum = 9 (1+3+5)', () => {
    expect(isObjectiveCompleted(Objectives.OneLineWithValueOf9, [
      card(Y1, 0, 0), card(B3, 1, 0), card(G5, 2, 0)
    ])).toBe(true)
  })

  it('fails when row sum is 8', () => {
    expect(isObjectiveCompleted(Objectives.OneLineWithValueOf9, [
      card(Y2, 0, 0), card(B3, 1, 0), card(G3, 2, 0)
    ])).toBe(false)
  })

  it('fails when row sum is 10', () => {
    expect(isObjectiveCompleted(Objectives.OneLineWithValueOf9, [
      card(Y4, 0, 0), card(B3, 1, 0), card(G3, 2, 0)
    ])).toBe(false)
  })

  it('fails when row is incomplete (bounding box width < 3)', () => {
    expect(isObjectiveCompleted(Objectives.OneLineWithValueOf9, [
      card(Y4, 0, 0), card(B5, 1, 0)
    ])).toBe(false)
  })
})

// ─── 15. OneColumnWithValueOf12 ──────────────────────────────────────────────

describe('OneColumnWithValueOf12', () => {
  it('passes with column sum = 12 (4+4+4)', () => {
    expect(isObjectiveCompleted(Objectives.OneColumnWithValueOf12, [
      card(Y4, 0, 0), card(B4, 0, 1), card(G4, 0, 2)
    ])).toBe(true)
  })

  it('passes with column sum = 12 (3+4+5)', () => {
    expect(isObjectiveCompleted(Objectives.OneColumnWithValueOf12, [
      card(Y3, 0, 0), card(B4, 0, 1), card(G5, 0, 2)
    ])).toBe(true)
  })

  it('fails when column sum is 11', () => {
    expect(isObjectiveCompleted(Objectives.OneColumnWithValueOf12, [
      card(Y3, 0, 0), card(B4, 0, 1), card(G4, 0, 2)
    ])).toBe(false)
  })

  it('fails when column is incomplete (bounding box height < 3)', () => {
    expect(isObjectiveCompleted(Objectives.OneColumnWithValueOf12, [
      card(Y5, 0, 0), card(B5, 0, 1)
    ])).toBe(false)
  })
})

// ─── 16. ThreeStacksWithScissors ─────────────────────────────────────────────

describe('ThreeStacksWithScissors', () => {
  it('passes with 3 scissors cards visible', () => {
    expect(isObjectiveCompleted(Objectives.ThreeStacksWithScissors, [
      card(YS1, 0, 0), card(BS1, 1, 0), card(GS1, 2, 0)
    ])).toBe(true)
  })

  it('fails with only 2 scissors cards visible', () => {
    expect(isObjectiveCompleted(Objectives.ThreeStacksWithScissors, [
      card(YS1, 0, 0), card(BS1, 1, 0), card(Y1, 2, 0)
    ])).toBe(false)
  })

  it('does not count buried scissors cards', () => {
    // (0,0): YS1 buried under Y2 → top is Y2 (no scissors)
    expect(isObjectiveCompleted(Objectives.ThreeStacksWithScissors, [
      card(YS1, 0, 0, 0), card(Y2, 0, 0, 1),
      card(BS1, 1, 0), card(GS1, 2, 0)
    ])).toBe(false)
  })
})

// ─── 17. SquareOf3 ───────────────────────────────────────────────────────────

describe('SquareOf3', () => {
  it('passes with 2×2 square where all top cards have value 3', () => {
    expect(isObjectiveCompleted(Objectives.SquareOf3, [
      card(Y3, 0, 0), card(B3, 1, 0), card(G3, 0, 1), card(K3, 1, 1)
    ])).toBe(true)
  })

  it('fails when one card in the 2×2 has wrong value', () => {
    expect(isObjectiveCompleted(Objectives.SquareOf3, [
      card(Y3, 0, 0), card(B3, 1, 0), card(G3, 0, 1), card(K4, 1, 1)
    ])).toBe(false)
  })

  it('fails when 4 value-3 cards are not in a 2×2 square', () => {
    expect(isObjectiveCompleted(Objectives.SquareOf3, [
      card(Y3, 0, 0), card(B3, 1, 0), card(G3, 2, 0), card(K3, 0, 1)
      // (0,0),(1,0),(2,0),(0,1) — not a 2×2
    ])).toBe(false)
  })
})

// ─── 18. SquareOfSameColor ───────────────────────────────────────────────────

describe('SquareOfSameColor', () => {
  it('passes with 2×2 square of yellow cards', () => {
    expect(isObjectiveCompleted(Objectives.SquareOfSameColor, [
      card(Y1, 0, 0), card(Y2, 1, 0), card(Y3, 0, 1), card(Y4, 1, 1)
    ])).toBe(true)
  })

  it('fails when one card in the 2×2 has different color', () => {
    expect(isObjectiveCompleted(Objectives.SquareOfSameColor, [
      card(Y1, 0, 0), card(Y2, 1, 0), card(Y3, 0, 1), card(B4, 1, 1)
    ])).toBe(false)
  })

  it('passes when same-color 2×2 exists within a larger panorama', () => {
    expect(isObjectiveCompleted(Objectives.SquareOfSameColor, [
      card(B1, 0, 0), card(Y1, 1, 0), card(Y2, 2, 0),
      card(G1, 0, 1), card(Y3, 1, 1), card(Y4, 2, 1)
      // Yellow square at (1,0),(2,0),(1,1),(2,1)
    ])).toBe(true)
  })
})

// ─── 19. CrossOfDifferentValues ──────────────────────────────────────────────

describe('CrossOfDifferentValues', () => {
  it('passes with + cross containing values 1,2,3,4,5', () => {
    expect(isObjectiveCompleted(Objectives.CrossOfDifferentValues, [
      card(Y3, 1, 1),              // center  = 3
      card(B1, 1, 0),              // top     = 1
      card(G2, 0, 1),              // left    = 2
      card(K4, 2, 1),              // right   = 4
      card(Y5, 1, 2)               // bottom  = 5
    ])).toBe(true)
  })

  it('fails when center value equals an arm value', () => {
    expect(isObjectiveCompleted(Objectives.CrossOfDifferentValues, [
      card(Y3, 1, 1),              // center  = 3
      card(B3, 1, 0),              // top     = 3  ← duplicate
      card(G2, 0, 1),
      card(K4, 2, 1),
      card(Y5, 1, 2)
    ])).toBe(false)
  })

  it('fails when an arm is missing', () => {
    expect(isObjectiveCompleted(Objectives.CrossOfDifferentValues, [
      card(Y3, 1, 1), card(B1, 1, 0), card(G2, 0, 1), card(K4, 2, 1)
      // missing bottom
    ])).toBe(false)
  })
})

// ─── 20. CrossOfDifferentColors ──────────────────────────────────────────────

describe('CrossOfDifferentColors', () => {
  it('passes when 4 arms have 4 different colors (center color irrelevant)', () => {
    expect(isObjectiveCompleted(Objectives.CrossOfDifferentColors, [
      card(Y1, 1, 1),              // center  = Yellow (doesn't matter)
      card(B1, 1, 0),              // top     = Blue
      card(G1, 0, 1),              // left    = Green
      card(K1, 2, 1),              // right   = Black
      card(Y2, 1, 2)               // bottom  = Yellow (same as center, ok)
    ])).toBe(true)
  })

  it('fails when two arms share the same color', () => {
    expect(isObjectiveCompleted(Objectives.CrossOfDifferentColors, [
      card(Y1, 1, 1),
      card(B1, 1, 0),              // top    = Blue
      card(B2, 0, 1),              // left   = Blue ← duplicate
      card(G1, 2, 1),
      card(K1, 1, 2)
    ])).toBe(false)
  })

  it('fails with only 3 unique colors among the 4 arms', () => {
    expect(isObjectiveCompleted(Objectives.CrossOfDifferentColors, [
      card(Y1, 1, 1),
      card(B1, 1, 0),
      card(G1, 0, 1),
      card(G2, 2, 1),              // right = Green ← same as left
      card(K1, 1, 2)
    ])).toBe(false)
  })

  it('fails when one arm is missing', () => {
    expect(isObjectiveCompleted(Objectives.CrossOfDifferentColors, [
      card(Y1, 1, 1), card(B1, 1, 0), card(G1, 0, 1), card(K1, 2, 1)
      // missing bottom
    ])).toBe(false)
  })
})
