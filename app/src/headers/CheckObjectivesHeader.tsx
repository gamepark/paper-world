import { PaperWorldRules } from '@gamepark/paper-world'
import { LandscapeColor } from '@gamepark/paper-world/material/Landscape'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

export const CheckObjectivesHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<PaperWorldRules>()
  const playerId = usePlayerId<LandscapeColor>()
  const activePlayer = rules?.game.rule?.player as LandscapeColor | undefined
  const activePlayerName = usePlayerName(activePlayer)

  if (activePlayer !== playerId) {
    return <>{t('objectives.check.opponent', { player: activePlayerName })}</>
  }

  return <>{t('objectives.check')}</>
}
