import { CustomMoveType } from '@gamepark/paper-world/material/CustomMoveType'
import { PaperWorldRules } from '@gamepark/paper-world'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

export const TakeScissorsHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<PaperWorldRules>()
  const playerId = usePlayerId<number>()
  const activePlayer = rules?.game.rule?.player as number | undefined
  const activePlayerName = usePlayerName(activePlayer)

  const takeMove = useLegalMove(isCustomMoveType(CustomMoveType.TakeScissorsToken))
  const skipMove = useLegalMove(isCustomMoveType(CustomMoveType.SkipScissorsToken))

  if (activePlayer !== playerId) {
    return <>{t('scissors.decision.opponent', { player: activePlayerName })}</>
  }

  return <>
    {t('scissors.decision')}
    {takeMove && <>&nbsp;<PlayMoveButton move={takeMove}>{t('scissors.take')}</PlayMoveButton></>}
    {skipMove && <>&nbsp;<PlayMoveButton move={skipMove}>{t('scissors.skip')}</PlayMoveButton></>}
  </>
}
