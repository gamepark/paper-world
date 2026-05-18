import { LandscapeHelper } from '@gamepark/paper-world/rules/helpers/LandscapeHelper'
import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { landscapeCardDescription } from '../material/LandScapeCardDescription'
import { landscapeLocator } from './LandscapeLocator'

class ScissorsTokenLandscapeSpotLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const { xMax, xMin, yMax, yMin } = new LandscapeHelper(context.rules.game, location.player!).boundaries
    const base = landscapeLocator.getBaseCoordinates(location, context)
    const deltaX = (xMin + xMax) / 2
    const deltaY = (yMin + yMax) / 2
    return {
      x: base.x + (location.x! - deltaX) * (landscapeCardDescription.width + 0.2),
      y: base.y + (location.y! - deltaY) * (landscapeCardDescription.height + 0.2),
      z: 5
    }
  }

  getPositionDependencies(location: Location, context: MaterialContext) {
    return {
      players: context.rules.players.length,
      boundaries: new LandscapeHelper(context.rules.game, location.player!).boundaries
    }
  }
}

export const scissorsTokenLandscapeSpotLocator = new ScissorsTokenLandscapeSpotLocator()
