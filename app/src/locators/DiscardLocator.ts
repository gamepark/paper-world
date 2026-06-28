import { DeckLocator, getRelativePlayerIndex, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { playerPositions, Position } from './LandscapeLocator'

class DiscardLocator extends DeckLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    const position = playerPositions[context.rules.players.length - 2][playerIndex]
    switch (position) {
      case Position.TopLeft: return { x: -46, y: -22 }
      case Position.TopRight: return { x: 46, y: -22 }
      case Position.BottomLeft: return { x: -44, y: 24 }
      case Position.BottomCenter: return { x: -14, y: 28 }
      case Position.BottomRight: return { x: 44, y: 24 }
    }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length, viewer: context.player }
  }
}

export const discardLocator = new DiscardLocator()
