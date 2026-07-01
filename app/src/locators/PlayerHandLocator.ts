import { HandLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext): Coordinates {
    const players = context.rules.players as number[]
    const viewer = context.player as number | undefined
    const viewerIndex = viewer !== undefined ? players.indexOf(viewer) : 0
    const locationIndex = players.indexOf(location.player as number)
    const seat = (locationIndex - viewerIndex + players.length) % players.length

    const z = super.getCoordinates(location, context).z ?? 0
    switch (seat) {
      case 0: return { x: -27, y: 25, z }
      case 1: return { x: 30, y: 25, z }
      default: return { x: 0, y: 25, z }
    }
  }

  getBaseAngle(): number {
    return 0
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length, viewer: context.player }
  }
}

export const playerHandLocator = new PlayerHandLocator()
