import { listingToList } from '@gamepark/rules-api'

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

const blueBackLandscapes: Record<Landscape, number> = {
  [Landscape.Yellow1]: 3,
  [Landscape.Yellow2]: 2,
  [Landscape.Yellow3]: 3,
  [Landscape.Yellow4]: 1,
  [Landscape.Yellow5]: 1,
  [Landscape.YellowScissors1]: 1,
  [Landscape.YellowScissors2]: 1,
  [Landscape.YellowScissors3]: 0,
  [Landscape.YellowScissors4]: 1,
  [Landscape.Blue1]: 3,
  [Landscape.Blue2]: 2,
  [Landscape.Blue3]: 2,
  [Landscape.Blue4]: 2,
  [Landscape.Blue5]: 1,
  [Landscape.BlueScissors1]: 1,
  [Landscape.BlueScissors2]: 1,
  [Landscape.BlueScissors3]: 1,
  [Landscape.BlueScissors4]: 0,
  [Landscape.Green1]: 3,
  [Landscape.Green2]: 3,
  [Landscape.Green3]: 2,
  [Landscape.Green4]: 1,
  [Landscape.Green5]: 1,
  [Landscape.GreenScissors1]: 1,
  [Landscape.GreenScissors2]: 0,
  [Landscape.GreenScissors3]: 1,
  [Landscape.GreenScissors4]: 1,
  [Landscape.Black1]: 4,
  [Landscape.Black2]: 2,
  [Landscape.Black3]: 2,
  [Landscape.Black4]: 1,
  [Landscape.Black5]: 1,
  [Landscape.BlackScissors1]: 0,
  [Landscape.BlackScissors2]: 1,
  [Landscape.BlackScissors3]: 1,
  [Landscape.BlackScissors4]: 1
}

const yellowBackLandscapes = [
  Landscape.Yellow1,
  Landscape.YellowScissors2,
  Landscape.Yellow3,
  Landscape.Yellow4,
  Landscape.Yellow5,
  Landscape.BlueScissors1,
  Landscape.Blue2,
  Landscape.Blue3,
  Landscape.Blue4,
  Landscape.Blue5,
  Landscape.Green1,
  Landscape.Green2,
  Landscape.GreenScissors3,
  Landscape.Green4,
  Landscape.Green5,
  Landscape.Black1,
  Landscape.Black2,
  Landscape.Black3,
  Landscape.BlackScissors4,
  Landscape.Black5
]

const redBackLandscapes = [
  Landscape.Yellow1,
  Landscape.Yellow2,
  Landscape.YellowScissors3,
  Landscape.Yellow4,
  Landscape.Yellow5,
  Landscape.Blue1,
  Landscape.Blue2,
  Landscape.Blue3,
  Landscape.BlueScissors4,
  Landscape.Blue5,
  Landscape.Green1,
  Landscape.GreenScissors2,
  Landscape.Green3,
  Landscape.Green4,
  Landscape.Green5,
  Landscape.BlackScissors1,
  Landscape.Black2,
  Landscape.Black3,
  Landscape.Black4,
  Landscape.Black5
]

export function getLandscapes(players: number) {
  const landscapes = listingToList(blueBackLandscapes)
  if (players >= 3) {
    landscapes.push(...yellowBackLandscapes)
  }
  if (players === 4) {
    landscapes.push(...redBackLandscapes)
  }
  return landscapes
}
