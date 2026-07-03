import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { landscapeCardDescription } from '../material/LandScapeCardDescription'

class LandscapePileLocator extends DeckLocator {
  getCoordinates(location: Location, _context: MaterialContext) {
    return { x: 10 + landscapeCardDescription.width * location.id! + location.id!, y: -15 }
  }
}

export const landscapePileLocator = new LandscapePileLocator()
