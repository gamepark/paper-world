import { CompetitiveScore, hideItemIdToOthers, MaterialGame, MaterialMove, PositiveSequenceStrategy, SecretMaterialRules, TimeLimit } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Memory } from './material/Memory'
import { RuleId } from './rules/RuleId'
import { CheckObjectivesRule } from './rules/CheckObjectivesRule'
import { ChooseActionRule } from './rules/ChooseActionRule'
import { DiscardToLimitRule } from './rules/DiscardToLimitRule'
import { ScoreHelper } from './rules/helpers/ScoreHelper'
import { PlaceCardRule } from './rules/PlaceCardRule'
import { TakeScissorsRule } from './rules/TakeScissorsRule'

export class PaperWorldRules
  extends SecretMaterialRules<number, MaterialType, LocationType>
  implements
    TimeLimit<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>, number>,
    CompetitiveScore<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>, number>
{
  rules = {
    [RuleId.ChooseAction]: ChooseActionRule,
    [RuleId.PlaceCard]: PlaceCardRule,
    [RuleId.DiscardToLimit]: DiscardToLimitRule,
    [RuleId.TakeScissors]: TakeScissorsRule,
    [RuleId.CheckObjectives]: CheckObjectivesRule
  }

  hidingStrategies = {
    [MaterialType.LandscapeCard]: {
      [LocationType.PlayerHand]: hideItemIdToOthers,
    },
  }

  locationsStrategies = {
    [MaterialType.LandscapeCard]: {
      [LocationType.Pile]: new PositiveSequenceStrategy(),
      [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
      [LocationType.Discard]: new PositiveSequenceStrategy()
    },
    [MaterialType.ScoreToken]: {
      [LocationType.ScoreTokensSpot]: new PositiveSequenceStrategy()
    }
  }

  giveTime(): number {
    return 60
  }

  isAdvancedMode(): boolean {
    return !!this.remind(Memory.AdvancedMode)
  }

  getScore(player: number): number {
    return new ScoreHelper(this.game).getScore(player)
  }

  getTieBreaker(tieBreaker: number, player: number): number | undefined {
    if (tieBreaker === 1) {
      // Fewer cards in discard wins (return negative so lower discard = higher rank)
      return -new ScoreHelper(this.game).getDiscardCount(player)
    }
    return undefined
  }
}
