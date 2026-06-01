import { getEnumValues } from '@gamepark/rules-api'

export enum ScoreToken {
  ScoreToken1 = 1,
  ScoreToken2,
  ScoreToken4
}

export const scoreToken = getEnumValues(ScoreToken)

export function getScoreTokenValue(token: ScoreToken): number {
  switch (token) {
    case ScoreToken.ScoreToken1: return 1
    case ScoreToken.ScoreToken2: return 2
    case ScoreToken.ScoreToken4: return 4
  }
}
