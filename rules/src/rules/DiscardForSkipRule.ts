import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from '../material/Memory'
import { RuleId } from './RuleId'

export class DiscardForSkipRule extends PlayerTurnRule {
  get remaining(): number {
    return this.remind<number>(Memory.SkipDiscardRemaining, this.player) ?? 0
  }

  onRuleStart(): MaterialMove[] {
    if (this.remaining <= 0) {
      return this.resume()
    }
    return []
  }

  getPlayerMoves(): MaterialMove[] {
    return this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand)
      .player(this.player)
      .moveItems({ type: LocationType.Discard, player: this.player })
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.LandscapeCard)(move)) return []
    if (move.location.type !== LocationType.Discard) return []
    const remaining = this.remaining - 1
    this.memorize(Memory.SkipDiscardRemaining, remaining, this.player)
    if (remaining <= 0) {
      return this.resume()
    }
    return []
  }

  private resume(): MaterialMove[] {
    const nextRule = this.remind<number>(Memory.SkipDiscardNextRule, this.player) ?? RuleId.PlaceCard
    this.forget(Memory.SkipDiscardRemaining, this.player)
    this.forget(Memory.SkipDiscardNextRule, this.player)
    return [this.startPlayerTurn(nextRule, this.player)]
  }
}
