import { CustomMove, isCustomMoveType, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapeValue, hasScissors, Landscape } from '../material/Landscape'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from '../material/CustomMoveType'
import { RuleId } from './RuleId'

export class TakeScissorsRule extends PlayerTurnRule {
  get marker() {
    return this.material(MaterialType.PlaceMarker).player(this.player).getItem()!
  }

  getPlayerMoves(): MaterialMove[] {
    const scissorsCardIndex = this.findScissorsCardIndex()
    return [
      this.customMove(CustomMoveType.TakeScissorsToken, { scissorsCardIndex }),
      this.customMove(CustomMoveType.SkipScissorsToken, {})
    ]
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (isCustomMoveType(CustomMoveType.TakeScissorsToken)(move)) {
      const { scissorsCardIndex } = move.data as { scissorsCardIndex: number }
      return [
        this.material(MaterialType.ScissorsToken)
          .moveItem({ type: LocationType.ScissorsTokenPlayerSpot, player: this.player, id: scissorsCardIndex }),
        this.startPlayerTurn(RuleId.PlaceCard, this.player)
      ]
    }

    if (isCustomMoveType(CustomMoveType.SkipScissorsToken)(move)) {
      return [this.startPlayerTurn(RuleId.PlaceCard, this.player)]
    }

    return []
  }

  private findScissorsCardIndex(): number {
    const mode = this.marker.location.id ?? 0
    const firstColor = this.marker.location.x ?? 0
    const firstValue = this.marker.location.y ?? 0

    const allCards = (this.game as any).items?.[MaterialType.LandscapeCard] as (any | null)[] | undefined
    if (!allCards) return -1

    let result = -1
    for (let i = 0; i < allCards.length; i++) {
      const card = allCards[i]
      if (card == null) continue
      if (card.location?.type !== LocationType.Landscape) continue
      if (card.location?.player !== this.player) continue
      if (!hasScissors(card.id as Landscape)) continue
      const color = getLandscapeColor(card.id as Landscape)
      const value = getLandscapeValue(card.id as Landscape)
      const matches = mode === 1 ? color === firstColor
        : mode === 2 ? value === firstValue
        : color === firstColor && value === firstValue
      if (matches) result = i
    }
    return result
  }
}
