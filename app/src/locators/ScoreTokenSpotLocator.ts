import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class ScoreTokenSpotLocator extends PileLocator {
  radius = 1
  getCoordinates(location: Location, context: MaterialContext) {
    const { x } = super.getCoordinates(location, context)
    return { x: x! + 7 * location.id! + 0.1 * location.id!, y: 15 }
  }
}

export const scoreTokenSpotLocator = new ScoreTokenSpotLocator()
