export enum Landscape {
  Yellow1 = 10,
  Yellow2,
  Yellow3,
  Yellow4,
  Yellow5,
  Yellow1Scissors,
  Yellow2Scissors,
  Yellow3Scissors,
  Yellow4Scissors,
  Yellow5Scissors,
  Blue1,
  Blue2,
  Blue3,
  Blue4,
  Blue5,
  Blue1Scissors,
  Blue2Scissors,
  Blue3Scissors,
  Blue4Scissors,
  Blue5Scissors,
  Green1,
  Green2,
  Green3,
  Green4,
  Green5,
  Green1Scissors,
  Green2Scissors,
  Green3Scissors,
  Green4Scissors,
  Green5Scissors,
  Black1,
  Black2,
  Black3,
  Black4,
  Black5,
  Black1Scissors,
  Black2Scissors,
  Black3Scissors,
  Black4Scissors,
  Black5Scissors
}

export enum LandscapeColor {
  Yellow = 1,
  Blue,
  Green,
  Black
}

export const getLandscapeColor = (landscape: Landscape): LandscapeColor => Math.floor(landscape / 10)
export const getLandscapeValue = (landscape: Landscape) => (landscape + 1) % 5
export const hasScissors = (landscape: Landscape) => landscape % 10 >= 5
