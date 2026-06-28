import { CustomMove, isCustomMoveType, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from '../material/CustomMoveType'
import { Memory } from '../material/Memory'
import { RuleId } from './RuleId'

export class TakeScissorsRule extends PlayerTurnRule {
  getPlayerMoves(): MaterialMove[] {
    const scissorsCardIndex = this.remind<number>(Memory.LastScissorsCardIndex)
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
}
