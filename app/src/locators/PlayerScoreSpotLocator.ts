import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { landscapeLocator } from './LandscapeLocator'

class PlayerScoreSpotLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const base = landscapeLocator.getBaseCoordinates(location, context)
    return {
      x: base.x - 8 + (location.id! * 4.5),
      y: base.y + 13
    }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length }
  }
}

export const playerScoreSpotLocator = new PlayerScoreSpotLocator()
