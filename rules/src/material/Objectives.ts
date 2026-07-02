import { getEnumValues } from '@gamepark/rules-api'
import { shuffle } from 'es-toolkit'

export enum Objectives {
  LOfSameColor = 1,
  FourCornersWithTheSameValue,
  LOf2s,
  SquareOfDifferentColors,
  NineStacks,
  OneDiagonalOfSameColor,
  OneLineOf3s,
  TwoStacksOf5s,
  OneTwoThreeFourFiveVisible,
  OneColumnWith252,
  OneDiagonalWith234,
  ThreeStacksOf4s,
  FiveStacksOf1s,
  OneLineWithValueOf9,
  OneColumnWithValueOf12,
  ThreeStacksWithScissors,
  SquareOf3,
  SquareOfSameColor,
  CrossOfDifferentValues,
  CrossOfDifferentColors
}

const objectives = getEnumValues(Objectives)

export function getRandomObjectives(): Objectives[] {
  return shuffle(objectives).slice(0, 3)
}

/**
 * The 3 objective cards marked with a star in the rulebook, recommended for a first game.
 */
export const beginnerObjectives: Objectives[] = [Objectives.LOfSameColor, Objectives.OneLineWithValueOf9, Objectives.ThreeStacksWithScissors]
