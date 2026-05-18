import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { HAND_LIMIT } from '@gamepark/paper-world/rules/DiscardToLimitRule'
import { PaperWorldRules } from '@gamepark/paper-world'
import { LandscapeColor } from '@gamepark/paper-world/material/Landscape'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

export const DiscardHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<PaperWorldRules>()
  const playerId = usePlayerId<LandscapeColor>()
  const activePlayer = rules?.game.rule?.player as LandscapeColor | undefined
  const activePlayerName = usePlayerName(activePlayer)

  const handCount = rules?.material(MaterialType.LandscapeCard)
    .location(LocationType.PlayerHand)
    .player(activePlayer!)
    .getItems().length ?? 0

  if (activePlayer !== playerId) {
    return <>{t('discard.opponent', { player: activePlayerName })}</>
  }

  return <>{t('discard.choose', { count: handCount - HAND_LIMIT })}</>
}
