import { HandLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { LandscapeColor } from '@gamepark/paper-world/material/Landscape'

class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext): Coordinates {
    const players = context.rules.players as LandscapeColor[]
    const viewer = context.player as LandscapeColor | undefined
    const viewerIndex = viewer !== undefined ? players.indexOf(viewer) : 0
    const locationIndex = players.indexOf(location.player as LandscapeColor)
    const seat = (locationIndex - viewerIndex + players.length) % players.length

    switch (seat) {
      case 0: return { x: -27, y: 25 }
      case 1: return { x: 30, y: 25 }
      default: return { x: 0, y: 25 }
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
