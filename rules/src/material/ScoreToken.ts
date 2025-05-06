import { getEnumValues } from '@gamepark/rules-api'

export enum ScoreToken {
  ScoreToken1 = 1,
  ScoreToken2,
  ScoreToken4
}

export const scoreToken = getEnumValues(ScoreToken)
