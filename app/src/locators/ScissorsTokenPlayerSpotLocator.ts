import { hasScissors, Landscape } from '@gamepark/paper-world/material/Landscape'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { landscapeLocator } from './LandscapeLocator'

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

  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { players: context.rules.players.length }
  }
}

export const scissorsTokenPlayerSpotLocator = new ScissorsTokenPlayerSpotLocator()
