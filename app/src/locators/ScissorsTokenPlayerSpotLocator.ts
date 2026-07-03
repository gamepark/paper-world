import { hasScissors, Landscape } from '@gamepark/paper-world/material/Landscape'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { getRelativePlayerIndex, ItemContext, Locator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { landscapeLocator } from './LandscapeLocator'
import { OPPONENT_SCALE } from './PlayerRowLayout'

class ScissorsTokenPlayerSpotLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const allCards = (context.rules.game as any).items?.[MaterialType.LandscapeCard] as any[] | undefined
    const scissorsCard = location.id !== undefined
      ? allCards?.[location.id]
      : allCards?.find((item: any) =>
          item != null &&
          item.location?.type === LocationType.Landscape &&
          item.location?.player === location.player &&
          hasScissors(item.id as Landscape)
        )
    if (!scissorsCard) return {}
    const coords = landscapeLocator.getCoordinates(scissorsCard.location as Location, context)
    return coords ? { ...coords, z: 5 } : {}
  }

  placeItem(item: MaterialItem, context: ItemContext) {
    const transform = super.placeItem(item, context)
    const playerIndex = getRelativePlayerIndex(context, item.location.player)
    if (playerIndex !== 0) {
      transform.push(`scale(${OPPONENT_SCALE})`)
    }
    return transform
  }

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length }
  }
}

export const scissorsTokenPlayerSpotLocator = new ScissorsTokenPlayerSpotLocator()
