import { PaperWorldRules } from '@gamepark/paper-world'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

export const DiscardForSkipHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<PaperWorldRules>()
  const playerId = usePlayerId<number>()
  const activePlayer = rules?.game.rule?.player as number | undefined
  const activePlayerName = usePlayerName(activePlayer)

  const count = activePlayer !== undefined ? rules?.getSkipDiscardRemaining(activePlayer) ?? 0 : 0

  if (activePlayer !== playerId) {
    return <>{t('discardForSkip.opponent', { player: activePlayerName })}</>
  }

  return <>{t('discardForSkip.choose', { count })}</>
}
