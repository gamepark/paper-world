import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class ScoreTokenSpotLocator extends PileLocator {
  coordinates = { x: -7.5, y: -19 }
  radius = 1
  getCoordinates(location: Location, context: MaterialContext) {
    const numberOfPlayers = context.rules.players.length
    const { x, y } = super.getCoordinates(location, context)
    if(numberOfPlayers === 4) {
      return { x: x! + 7 * location.id! + 0.5 * location.id!, y }
    } else {
      return { x: x! + 25 + 7 * location.id! + 0.5 * location.id!, y }
    }
  }
}

export const scoreTokenSpotLocator = new ScoreTokenSpotLocator()
