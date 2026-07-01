import { CustomMoveType } from '@gamepark/paper-world/material/CustomMoveType'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { PaperWorldRules } from '@gamepark/paper-world'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

export const PlaceCardHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<PaperWorldRules>()
  const playerId = usePlayerId<number>()
  const activePlayer = rules?.game.rule?.player as number | undefined
  const activePlayerName = usePlayerName(activePlayer)

  const endPlaceMove = useLegalMove(isCustomMoveType(CustomMoveType.EndPlace))
  const hasDiscardForSkip = useLegalMove(
    m => isMoveItemType(MaterialType.LandscapeCard)(m) && m.location.type === LocationType.Discard
  )

  const marker = rules?.material(MaterialType.PlaceMarker).player(activePlayer!).getItem()
  const mode = marker?.location.id ?? 0
  const skipPending = (marker?.location.rotation ?? 0) === 1

  if (activePlayer !== playerId) {
    return <>{t('place.opponent', { player: activePlayerName })}</>
  }

  return <>
    {skipPending
      ? t('place.skip.pending')
      : mode === 0 ? t('place.first')
      : mode === 1 ? t('place.color')
      : t('place.value')
    }
    {!skipPending && hasDiscardForSkip && <>&nbsp;{t('place.skip')}</>}
    {endPlaceMove && <>&nbsp;<PlayMoveButton move={endPlaceMove}>{t('place.end')}</PlayMoveButton></>}
  </>
}
