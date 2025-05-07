import { Locator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { objectiveCardDescription } from '../material/ObjectiveCardDescription'

class ObjectivesSpotLocator extends Locator {
  coordinates = { x: -7.5, y: -25 }

  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const numberOfPlayers = context.rules.players.length
    const { x, y } = super.getCoordinates(location, context)
    if (numberOfPlayers === 4) {
      return { x: x! + objectiveCardDescription.width * location.id + 0.5 * location.id, y }
    } else {
      return { x: x! + 25 + objectiveCardDescription.width * location.id + 0.5 * location.id, y }
    }
  }
}

export const objectivesSpotLocator = new ObjectivesSpotLocator()
