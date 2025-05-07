import { DeckLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { landscapeCardDescription } from '../material/LandScapeCardDescription'

class LandscapePileLocator extends DeckLocator {
  coordinates = { x: -15, y: 0 }

  getCoordinates(location: Location) {
    const { x, y = 0 } = this.coordinates
    return { x: x + landscapeCardDescription.width * location.id! + location.id! * 0.5, y }
  }
}

export const landscapePileLocator = new LandscapePileLocator()
