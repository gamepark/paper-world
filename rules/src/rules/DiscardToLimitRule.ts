import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export const HAND_LIMIT = 9

export class DiscardToLimitRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    if (this.handCount <= HAND_LIMIT) {
      return this.nextPlayerMoves()
    }
    return []
  }

  getPlayerMoves(): MaterialMove[] {
    return this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand)
      .player(this.player)
      .moveItems({ type: LocationType.Discard })
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.LandscapeCard)(move)) return []
    if (move.location.type !== LocationType.Discard) return []
    if (this.handCount <= HAND_LIMIT) {
      return this.nextPlayerMoves()
    }
    return []
  }

  get handCount(): number {
    return this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand)
      .player(this.player)
      .getItems().length
  }

  private nextPlayerMoves(): MaterialMove[] {
    const players = this.game.players
    const nextPlayer = players[(players.indexOf(this.player) + 1) % players.length]
    return [this.startPlayerTurn(RuleId.ChooseAction, nextPlayer)]
  }
}
