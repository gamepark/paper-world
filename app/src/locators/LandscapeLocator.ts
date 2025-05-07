import { getRelativePlayerIndex, Locator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { RADIUS } from './Radius'

const LOCATOR_RADIUS = RADIUS + 4

class LandscapeLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const numberOfPlayers = context.rules.players.length
    return {
      x: LOCATOR_RADIUS * Math.sin(((-Math.PI * getRelativePlayerIndex(context, location.player)) / numberOfPlayers) * 2),
      y: LOCATOR_RADIUS * Math.cos(((-Math.PI * getRelativePlayerIndex(context, location.player)) / numberOfPlayers) * 2)
    }
  }
}

export const landscapeLocator = new LandscapeLocator()
