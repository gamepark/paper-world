import { getLandscapeStars, Landscape } from '@gamepark/paper-world/material/Landscape'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { ScoreToken, getScoreTokenValue } from '@gamepark/paper-world/material/ScoreToken'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { getOccupiedPositions, getTopCard } from '@gamepark/paper-world/rules/helpers/PlacementHelper'
import { ScoringDescription } from '@gamepark/react-game'
import { createElement } from 'react'
import { Trans } from 'react-i18next'

const enum ScoringKey {
  Panorama = 1,
  Objectives,
  Scissors,
  Hand,
  Discard,
  Total
}

export const scoring: ScoringDescription<number, PaperWorldRules> = {
  getScoringKeys: () => [
    ScoringKey.Panorama,
    ScoringKey.Objectives,
    ScoringKey.Scissors,
    ScoringKey.Hand,
    ScoringKey.Discard,
    ScoringKey.Total
  ],

  getScoringHeader: (key) => {
    switch (key) {
      case ScoringKey.Panorama: return createElement(Trans, { i18nKey: 'score.panorama' })
      case ScoringKey.Objectives: return createElement(Trans, { i18nKey: 'score.objectives' })
      case ScoringKey.Scissors: return createElement(Trans, { i18nKey: 'score.scissors' })
      case ScoringKey.Hand: return createElement(Trans, { i18nKey: 'score.hand' })
      case ScoringKey.Discard: return createElement(Trans, { i18nKey: 'score.discard' })
      default: return createElement(Trans, { i18nKey: 'score.total' })
    }
  },

  getScoringPlayerData: (key, player, rules) => {
    switch (key) {
      case ScoringKey.Panorama: return getPanoramaScore(player, rules)
      case ScoringKey.Objectives: return getObjectivesScore(player, rules)
      case ScoringKey.Scissors: return getScissorsBonus(player, rules)
      case ScoringKey.Hand: return -getHandCount(player, rules)
      case ScoringKey.Discard: return -getDiscardCount(player, rules)
      default: return rules.getScore(player)
    }
  }
}

function getPanoramaScore(player: number, rules: PaperWorldRules): number {
  const panorama = rules.material(MaterialType.LandscapeCard)
    .location(LocationType.Landscape)
    .player(player)
    .getItems()
  return [...getOccupiedPositions(panorama)].reduce((sum, key) => {
    const [x, y] = key.split(',').map(Number)
    const top = getTopCard(x, y, panorama)
    return sum + (top ? getLandscapeStars(top.id as Landscape) : 0)
  }, 0)
}

function getObjectivesScore(player: number, rules: PaperWorldRules): number {
  return rules.material(MaterialType.ScoreToken)
    .location(LocationType.PlayerScoreSpot)
    .player(player)
    .getItems()
    .reduce((sum, item) => sum + getScoreTokenValue(item.id as ScoreToken), 0)
}

function getScissorsBonus(player: number, rules: PaperWorldRules): number {
  return rules.material(MaterialType.ScissorsToken)
    .location(LocationType.ScissorsTokenPlayerSpot)
    .player(player)
    .getItem() !== undefined ? 2 : 0
}

function getHandCount(player: number, rules: PaperWorldRules): number {
  return rules.material(MaterialType.LandscapeCard)
    .location(LocationType.PlayerHand)
    .player(player)
    .getItems().length
}

function getDiscardCount(player: number, rules: PaperWorldRules): number {
  return rules.material(MaterialType.LandscapeCard)
    .location(LocationType.Discard)
    .player(player)
    .getItems().length
}
