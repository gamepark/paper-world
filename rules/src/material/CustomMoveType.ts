export enum CustomMoveType {
  TakeByValue = 1,
  TakeByColor,
  EndPlace,
  TakeScissorsToken,
  SkipScissorsToken
}

export type TakeByValueData = { value: number; pileId: number }
export type TakeByColorData = { color: number; pileId: number }
