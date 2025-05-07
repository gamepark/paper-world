import { getEnumValues } from '@gamepark/rules-api'

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
  return objectives.sort(() => Math.random() - 0.5).slice(0, 3)
}
