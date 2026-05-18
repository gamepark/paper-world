import { MaterialGame, MaterialMove, MaterialRules, PositiveSequenceStrategy, TimeLimit } from '@gamepark/rules-api'
import { LandscapeColor } from './material/Landscape'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'
import { ChooseActionRule } from './rules/ChooseActionRule'
import { DiscardToLimitRule } from './rules/DiscardToLimitRule'
import { PlaceCardRule } from './rules/PlaceCardRule'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class PaperWorldRules
  extends MaterialRules<LandscapeColor, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<LandscapeColor, MaterialType, LocationType>, MaterialMove<LandscapeColor, MaterialType, LocationType>, LandscapeColor>
{
  rules = {
    [RuleId.ChooseAction]: ChooseActionRule,
    [RuleId.PlaceCard]: PlaceCardRule,
    [RuleId.DiscardToLimit]: DiscardToLimitRule
  }

  locationsStrategies = {
    [MaterialType.LandscapeCard]: {
      [LocationType.Pile]: new PositiveSequenceStrategy(),
      [LocationType.PlayerHand]: new PositiveSequenceStrategy()
    },
    [MaterialType.ScoreToken]: {
      [LocationType.ScoreTokensSpot]: new PositiveSequenceStrategy()
    }
  }

  giveTime(): number {
    return 60
  }
}
