import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { ScoreHelper } from '@gamepark/paper-world/rules/helpers/ScoreHelper'
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
    const scoreHelper = new ScoreHelper(rules.game)
    switch (key) {
      case ScoringKey.Panorama: return scoreHelper.getPanoramaScore(player)
      case ScoringKey.Objectives: return scoreHelper.getObjectivesScore(player)
      case ScoringKey.Scissors: return scoreHelper.getScissorsBonus(player)
      case ScoringKey.Hand: return -scoreHelper.getHandCount(player)
      case ScoringKey.Discard: return -scoreHelper.getDiscardCount(player)
      default: return scoreHelper.getScore(player)
    }
  }
}
