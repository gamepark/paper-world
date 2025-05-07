import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { landscapeCardDescription } from '../material/LandScapeCardDescription'

class LandscapePileLocator extends DeckLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const numberOfPlayers = context.rules.players.length
    if (numberOfPlayers === 4) {
      return { x: 0, y: -10 + landscapeCardDescription.width * location.id! + location.id! * 0.5 }
    } else {
      return { x: -35 + landscapeCardDescription.width * location.id! + location.id! * 0.5, y: -25 }
    }
  }
}

export const landscapePileLocator = new LandscapePileLocator()
