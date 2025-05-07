import { LandscapeHelper } from '@gamepark/paper-world/rules/helpers/LandscapeHelper'
import { getRelativePlayerIndex, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { landscapeCardDescription } from '../material/LandScapeCardDescription'

export enum Position {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomCenter,
  BottomRight
}

export const playerPositions = [
  [Position.BottomLeft, Position.BottomRight], // 2 players
  [Position.BottomLeft, Position.BottomCenter, Position.BottomRight], // 3 players
  [Position.BottomLeft, Position.TopLeft, Position.TopRight, Position.BottomRight] // 4 players
]

class LandscapeLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const { xMax, xMin, yMax, yMin } = new LandscapeHelper(context.rules.game, location.player!).boundaries
    const { x, y } = this.getBaseCoordinates(location, context)
    const deltaX = (xMin + xMax) / 2
    const deltaY = (yMin + yMax) / 2
    return {
      x: x + (location.x! - deltaX) * (landscapeCardDescription.width + 0.2),
      y: y + (location.y! - deltaY) * (landscapeCardDescription.height + 0.2)
    }
  }

  getBaseCoordinates(location: Location, context: MaterialContext) {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    const position = playerPositions[context.rules.players.length - 2][playerIndex]
    const players = context.rules.players.length
    switch (position) {
      case Position.TopLeft:
        return { x: -33, y: -15 }
      case Position.TopRight:
        return { x: 33, y: -15 }
      case Position.BottomLeft:
        return players === 2 ? { x: -27, y: 7 } : players === 3 ? { x: -35, y: 7 } : { x: -33, y: 15 }
      case Position.BottomCenter:
        return { x: 0, y: 7 }
      case Position.BottomRight:
        return players === 2 ? { x: 30, y: 7 } : players === 3 ? { x: 35, y: 7 } : { x: 33, y: 15 }
    }
  }
}

export const landscapeLocator = new LandscapeLocator()
