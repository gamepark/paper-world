import { Locator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { objectiveCardDescription } from '../material/ObjectiveCardDescription'

class ObjectivesSpotLocator extends Locator {
  coordinates = { x: -7.5, y: -15 }

  getCoordinates(location: Location, _context: MaterialContext): Partial<Coordinates> {
    const { x, y } = super.getCoordinates(location, _context)
    return { x: x! + objectiveCardDescription.width * location.id + 0.5 * location.id, y }
  }
}

export const objectivesSpotLocator = new ObjectivesSpotLocator()
