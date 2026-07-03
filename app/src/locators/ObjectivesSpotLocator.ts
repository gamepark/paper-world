import { Locator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { objectiveCardDescription } from '../material/ObjectiveCardDescription'

class ObjectivesSpotLocator extends Locator {

  getCoordinates(location: Location, _context: MaterialContext): Partial<Coordinates> {
    return { x: 25 + objectiveCardDescription.width * location.id + location.id, y: -5}
  }
}

export const objectivesSpotLocator = new ObjectivesSpotLocator()
