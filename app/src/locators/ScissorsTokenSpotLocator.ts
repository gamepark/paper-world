import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class ScissorsTokenSpotLocator extends Locator {
  coordinates = { x: 8, y: -25 }

  getCoordinates(location: Location, context: MaterialContext) {
    const numberOfPlayers = context.rules.players.length
    const { x, y } = super.getCoordinates(location, context)
    if (numberOfPlayers === 4) {
      return { x, y: 0 }
    } else {
      return { x, y }
    }
  }
}

export const scissorsTokenSpotLocator = new ScissorsTokenSpotLocator()
