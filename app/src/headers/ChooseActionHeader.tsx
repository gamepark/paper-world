import { CustomMoveType } from '@gamepark/paper-world/material/CustomMoveType'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { LandscapeColor } from '@gamepark/paper-world/material/Landscape'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules.ts'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

export const ChooseActionHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<PaperWorldRules>()
  const playerId = usePlayerId<LandscapeColor>()
  const activePlayer = rules?.game.rule?.player as LandscapeColor | undefined
  const activePlayerName = usePlayerName(activePlayer)

  const hasPendingCard = rules?.material(MaterialType.LandscapeCard)
    .location(LocationType.PendingTake)
    .getItem() !== undefined

  const takeByValueMove = useLegalMove(isCustomMoveType(CustomMoveType.TakeByValue))
  const takeByColorMove = useLegalMove(isCustomMoveType(CustomMoveType.TakeByColor))

  if (activePlayer !== playerId) {
    return <>{t('take.opponent', { player: activePlayerName })}</>
  }

  if (hasPendingCard) {
    return <>{t('take.pending.prefix')}&nbsp;
      {takeByColorMove && <PlayMoveButton move={takeByColorMove}>{t('take.by.color')}</PlayMoveButton>}
      &nbsp;{t('take.pending.or')}&nbsp;
      {takeByValueMove && <PlayMoveButton move={takeByValueMove}>{t('take.by.value')}</PlayMoveButton>}
    </>
  }

  return <>{t('take.choose')}</>
}

