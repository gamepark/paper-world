import { DeckLocator, getRelativePlayerIndex, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { getColumnCenterX, getColumnWidth, HAND_Y_OFFSET, OPPONENT_SCALE, OWN_HAND_Y_OFFSET, ROW_Y } from './PlayerRowLayout'

class DiscardLocator extends DeckLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const playerIndex = getRelativePlayerIndex(context, location.player)
    const playerCount = context.rules.players.length
    const scale = playerIndex === 0 ? 1 : OPPONENT_SCALE
    const x = getColumnCenterX(playerIndex, playerCount) + getColumnWidth(playerIndex, playerCount) * 0.32
    const y = ROW_Y + (playerIndex === 0 ? OWN_HAND_Y_OFFSET : HAND_Y_OFFSET * scale)
    return { x, y }
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length, viewer: context.player }
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const playerIndex = getRelativePlayerIndex(context, item.location.player)
    const scale = playerIndex === 0 ? 1 : OPPONENT_SCALE
    if (scale !== 1) transform.push(`scale(${scale})`)
    return transform
  }
}

export const discardLocator = new DiscardLocator()
