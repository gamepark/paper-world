import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class ScoreTokenSpotLocator extends PileLocator {
  coordinates = { x: -7.5, y: -9 }
  radius = 1
  getCoordinates(location: Location, context: MaterialContext) {
    const { x, y } = super.getCoordinates(location, context)
    return { x: x! + 7 * location.id! + 0.5 * location.id!, y }
  }
}

export const scoreTokenSpotLocator = new ScoreTokenSpotLocator()
