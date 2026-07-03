import { MaterialContext, DeckLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class ScoreTokenSpotLocator extends DeckLocator {
  gap = { x: -0.1}
  getCoordinates(location: Location, _context: MaterialContext) {
    return { x: 22 + 7 * location.id! + location.id!, y: -8 }
  }
}

export const scoreTokenSpotLocator = new ScoreTokenSpotLocator()
