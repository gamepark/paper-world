import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Objectives } from '../material/Objectives'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'
import { isObjectiveCompleted } from './helpers/ObjectiveHelper'

export class CheckObjectivesRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const objectives = this.material(MaterialType.ObjectiveCard).getItems()
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()

    for (const objective of objectives) {
      const idx = objective.location.id as number

      const alreadyClaimed = this.material(MaterialType.ScoreToken)
        .location(LocationType.PlayerScoreSpot)
        .player(this.player)
        .locationId(idx)
        .getItem() !== undefined
      if (alreadyClaimed) continue

      if (!isObjectiveCompleted(objective.id as Objectives, panorama)) continue

      const token = this.material(MaterialType.ScoreToken)
        .location(LocationType.ScoreTokensSpot)
        .locationId(idx)
        .maxBy(item => item.id as number)
      if (token.getItem()) {
        moves.push(token.moveItem({ type: LocationType.PlayerScoreSpot, player: this.player, id: idx }))
      }
    }

    const players = this.game.players
    const nextPlayer = players[(players.indexOf(this.player) + 1) % players.length]
    moves.push(this.startPlayerTurn(RuleId.ChooseAction, nextPlayer))
    return moves
  }

  getPlayerMoves(): MaterialMove[] {
    return []
  }
}
