import { MaterialRulesPart } from '@gamepark/rules-api'
import { getLandscapeStars, Landscape } from '../../material/Landscape'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { getScoreTokenValue, ScoreToken } from '../../material/ScoreToken'
import { getOccupiedPositions, getTopCard } from './PlacementHelper'

export class ScoreHelper extends MaterialRulesPart<number, MaterialType, LocationType> {
  getScore(player: number): number {
    return this.getPanoramaScore(player) + this.getObjectivesScore(player) + this.getScissorsBonus(player) - this.getHandCount(player) - this.getDiscardCount(player)
  }

  getPanoramaScore(player: number): number {
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape)
      .player(player)
      .getItems()
    return [...getOccupiedPositions(panorama)].reduce((sum, key) => {
      const [x, y] = key.split(',').map(Number)
      const top = getTopCard(x, y, panorama)
      return sum + (top ? getLandscapeStars(top.id as Landscape) : 0)
    }, 0)
  }

  getObjectivesScore(player: number): number {
    return this.material(MaterialType.ScoreToken)
      .location(LocationType.PlayerScoreSpot)
      .player(player)
      .getItems()
      .reduce((sum, item) => sum + getScoreTokenValue(item.id as ScoreToken), 0)
  }

  getScissorsBonus(player: number): number {
    return this.material(MaterialType.ScissorsToken)
      .location(LocationType.ScissorsTokenPlayerSpot)
      .player(player)
      .getItem() !== undefined ? 2 : 0
  }

  getHandCount(player: number): number {
    return this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand)
      .player(player)
      .getItems().length
  }

  getDiscardCount(player: number): number {
    return this.material(MaterialType.LandscapeCard)
      .location(LocationType.Discard)
      .player(player)
      .getItems().length
  }
}
