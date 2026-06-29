import { CompetitiveScore, MaterialGame, MaterialMove, MaterialRules, PositiveSequenceStrategy, TimeLimit } from '@gamepark/rules-api'
import { getLandscapeStars, Landscape, LandscapeColor } from './material/Landscape'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { ScoreToken, getScoreTokenValue } from './material/ScoreToken'
import { RuleId } from './rules/RuleId'
import { getOccupiedPositions, getTopCard } from './rules/helpers/PlacementHelper'
import { CheckObjectivesRule } from './rules/CheckObjectivesRule'
import { ChooseActionRule } from './rules/ChooseActionRule'
import { DiscardToLimitRule } from './rules/DiscardToLimitRule'
import { PlaceCardRule } from './rules/PlaceCardRule'
import { TakeScissorsRule } from './rules/TakeScissorsRule'

export class PaperWorldRules
  extends MaterialRules<LandscapeColor, MaterialType, LocationType>
  implements
    TimeLimit<MaterialGame<LandscapeColor, MaterialType, LocationType>, MaterialMove<LandscapeColor, MaterialType, LocationType>, LandscapeColor>,
    CompetitiveScore<MaterialGame<LandscapeColor, MaterialType, LocationType>, MaterialMove<LandscapeColor, MaterialType, LocationType>, LandscapeColor>
{
  rules = {
    [RuleId.ChooseAction]: ChooseActionRule,
    [RuleId.PlaceCard]: PlaceCardRule,
    [RuleId.DiscardToLimit]: DiscardToLimitRule,
    [RuleId.TakeScissors]: TakeScissorsRule,
    [RuleId.CheckObjectives]: CheckObjectivesRule
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

  getScore(player: LandscapeColor): number {
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape)
      .player(player)
      .getItems()

    const occupiedPositions = getOccupiedPositions(panorama)
    const panoramaScore = [...occupiedPositions].reduce((sum, key) => {
      const [x, y] = key.split(',').map(Number)
      const top = getTopCard(x, y, panorama)
      return sum + (top ? getLandscapeStars(top.id as Landscape) : 0)
    }, 0)

    const tokenScore = this.material(MaterialType.ScoreToken)
      .location(LocationType.PlayerScoreSpot)
      .player(player)
      .getItems()
      .reduce((sum, item) => sum + getScoreTokenValue(item.id as ScoreToken), 0)

    const scissorsBonus = this.material(MaterialType.ScissorsToken)
      .location(LocationType.ScissorsTokenPlayerSpot)
      .player(player)
      .getItem() !== undefined ? 2 : 0

    const handCount = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand)
      .player(player)
      .getItems().length

    const discardCount = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Discard)
      .player(player)
      .getItems().length

    return panoramaScore + tokenScore + scissorsBonus - handCount - discardCount
  }

  getTieBreaker(tieBreaker: number, player: LandscapeColor): number | undefined {
    if (tieBreaker === 1) {
      // Fewer cards in discard wins (return negative so lower discard = higher rank)
      return -this.material(MaterialType.LandscapeCard)
        .location(LocationType.Discard)
        .player(player)
        .getItems().length
    }
    return undefined
  }
}
