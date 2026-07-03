import { CustomMoveType } from '@gamepark/paper-world/material/CustomMoveType'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { RuleId } from '@gamepark/paper-world/rules/RuleId'
import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { DiscardLimitLog } from './DiscardLimitLog'
import { DiscardSkipLog } from './DiscardSkipLog'
import { ObjectiveCompletedLog } from './ObjectiveCompletedLog'
import { PlaceCardLog } from './PlaceCardLog'
import { ScissorsSkipLog } from './ScissorsSkipLog'
import { ScissorsTakeLog } from './ScissorsTakeLog'
import { TakeByColorLog } from './TakeByColorLog'
import { TakeByValueLog } from './TakeByValueLog'

export class PaperWorldLogs implements LogDescription<MaterialMove, number, MaterialGame> {
  getMovePlayedLogDescription(
    move: MaterialMove,
    context: MoveComponentContext<MaterialMove, number, MaterialGame>
  ): MovePlayedLogDescription | undefined {
    const player = context.game.rule?.player

    if (isCustomMoveType(CustomMoveType.TakeByValue)(move)) {
      return { player, Component: TakeByValueLog }
    }
    if (isCustomMoveType(CustomMoveType.TakeByColor)(move)) {
      return { player, Component: TakeByColorLog }
    }
    if (isCustomMoveType(CustomMoveType.TakeScissorsToken)(move)) {
      return { player, Component: ScissorsTakeLog }
    }
    if (isCustomMoveType(CustomMoveType.SkipScissorsToken)(move)) {
      return { player, Component: ScissorsSkipLog }
    }

    if (isMoveItemType(MaterialType.LandscapeCard)(move)) {
      if (move.location.type === LocationType.Landscape) {
        return { player, Component: PlaceCardLog }
      }
      if (move.location.type === LocationType.Discard) {
        const isHandLimitDiscard = context.game.rule?.id === RuleId.DiscardToLimit
        return isHandLimitDiscard
          ? { player, Component: DiscardLimitLog }
          : { player, Component: DiscardSkipLog }
      }
    }

    if (isMoveItemType(MaterialType.ScoreToken)(move) && move.location.type === LocationType.PlayerScoreSpot) {
      return { player: move.location.player, Component: ObjectiveCompletedLog }
    }

    return undefined
  }
}
