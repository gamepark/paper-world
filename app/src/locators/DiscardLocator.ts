import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class DiscardLocator extends DeckLocator {
  getCoordinates(_location: Location, context: MaterialContext) {
    const numberOfPlayers = context.rules.players.length
    if (numberOfPlayers === 4) {
      return { x: 17, y: -10 }
    }
    return { x: 22, y: -25 }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length }
  }
}

export const discardLocator = new DiscardLocator()
