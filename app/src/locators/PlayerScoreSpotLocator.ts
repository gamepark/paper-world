import { getRelativePlayerIndex, ItemContext, PileLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { landscapeLocator } from './LandscapeLocator'
import { OPPONENT_BONUS_Y_OFFSET, OPPONENT_SCALE } from './PlayerRowLayout'

class PlayerScoreSpotLocator extends PileLocator {
  // All 3 objective spots (location.id 0, 1, 2) of a player stack into a single pile.
  getPileId(item: MaterialItem, _context: ItemContext) {
    return `${item.location.player}`
  }

  getRadius(location: Location, context: MaterialContext): number {
    return 0.6 * this.getScale(location, context)
  }

  getCoordinates(location: Location, context: MaterialContext) {
    const base = landscapeLocator.getBaseCoordinates(location, context)
    const playerIndex = getRelativePlayerIndex(context, location.player)
    const scale = this.getScale(location, context)
    const y = playerIndex === 0 ? base.y + 13 * scale : base.y + OPPONENT_BONUS_Y_OFFSET * scale
    return {
      x: base.x - 10 * scale,
      y
    }
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

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length, viewer: context.player }
  }
}

export const playerScoreSpotLocator = new PlayerScoreSpotLocator()
