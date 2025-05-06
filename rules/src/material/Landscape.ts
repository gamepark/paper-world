export enum Landscape {
  Yellow1 = 11,
  Yellow2,
  Yellow3,
  Yellow4,
  Yellow5,
  YellowScissors1,
  YellowScissors2,
  YellowScissors3,
  YellowScissors4,
  Blue1 = 21,
  Blue2,
  Blue3,
  Blue4,
  Blue5,
  BlueScissors1,
  BlueScissors2,
  BlueScissors3,
  BlueScissors4,
  Green1 = 31,
  Green2,
  Green3,
  Green4,
  Green5,
  GreenScissors1,
  GreenScissors2,
  GreenScissors3,
  GreenScissors4,
  Black1 = 41,
  Black2,
  Black3,
  Black4,
  Black5,
  BlackScissors1,
  BlackScissors2,
  BlackScissors3,
  BlackScissors4
}

export enum LandscapeColor {
  Yellow = 1,
  Blue,
  Green,
  Black
}

export const getLandscapeColor = (landscape: Landscape): LandscapeColor => Math.floor(landscape / 10)
export const getLandscapeValue = (landscape: Landscape) => landscape % 5
export const hasScissors = (landscape: Landscape) => landscape % 10 > 5
