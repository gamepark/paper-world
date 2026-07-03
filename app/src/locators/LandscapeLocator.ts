import { LandscapeHelper } from '@gamepark/paper-world/rules/helpers/LandscapeHelper'
import { getRelativePlayerIndex, ItemContext, Locator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { landscapeCardDescription } from '../material/LandScapeCardDescription'
import { getColumnCenterX, OPPONENT_SCALE, ROW_Y } from './PlayerRowLayout'

class LandscapeLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const { xMax, xMin, yMax, yMin } = new LandscapeHelper(context.rules.game, location.player!).boundaries
    const { x, y } = this.getBaseCoordinates(location, context)
    const deltaX = (xMin + xMax) / 2
    const deltaY = (yMin + yMax) / 2
    const scale = this.getScale(location, context)
    return {
      x: x + (location.x! - deltaX) * (landscapeCardDescription.width + 0.2) * scale,
      y: y + (location.y! - deltaY) * (landscapeCardDescription.height + 0.2) * scale,
      z: (location.id ?? 0) * 0.05
    }
  }

  getPositionDependencies(location: Location, context: MaterialContext) {
    return {
      players: context.rules.players.length,
      boundaries: new LandscapeHelper(context.rules.game, location.player!).boundaries
    }
  }

  getBaseCoordinates(location: Location, context: MaterialContext) {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return { x: getColumnCenterX(playerIndex, context.rules.players.length), y: playerIndex === 0 ? ROW_Y : ROW_Y + 15}
  }

  getScale(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 ? 1 : OPPONENT_SCALE
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const scale = this.getScale(item.location, context)
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }
}

export const landscapeLocator = new LandscapeLocator()
