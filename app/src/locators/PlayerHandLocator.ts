import { getRelativePlayerIndex, HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { getColumnCenterX, getColumnWidth, HAND_Y_OFFSET, OPPONENT_SCALE, OWN_HAND_Y_OFFSET, ROW_Y } from './PlayerRowLayout'

class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext): Coordinates {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    const playerCount = context.rules.players.length
    const scale = this.getScale(location, context)
    const x = getColumnCenterX(playerIndex, playerCount) - getColumnWidth(playerIndex, playerCount) * 0.1
    const y = ROW_Y + (playerIndex === 0 ? OWN_HAND_Y_OFFSET : HAND_Y_OFFSET * scale)
    const z = super.getCoordinates(location, context).z ?? 0
    return { x, y, z }
  }

  getScale(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 ? 1 : OPPONENT_SCALE
  }

  getMaxAngle(_location: Location, _context: MaterialContext): number {
    return this.maxAngle / 2
  }

  getGapMaxAngle(location: Location, context: MaterialContext): number {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    return playerIndex === 0 ? this.gapMaxAngle / 2 : 0.5
  }

  getRadius(location: Location, context: MaterialContext): number {
    return this.radius * this.getScale(location, context)
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const scale = this.getScale(item.location, context)
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }

  getBaseAngle(): number {
    return 0
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length, viewer: context.player }
  }
}

export const playerHandLocator = new PlayerHandLocator()
