import { CustomMoveType } from '@gamepark/paper-world/material/CustomMoveType'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { PaperWorldRules } from '@gamepark/paper-world'
import { LandscapeColor } from '@gamepark/paper-world/material/Landscape'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

export const PlaceCardHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<PaperWorldRules>()
  const playerId = usePlayerId<LandscapeColor>()
  const activePlayer = rules?.game.rule?.player as LandscapeColor | undefined
  const activePlayerName = usePlayerName(activePlayer)

  const endPlaceMove = useLegalMove(isCustomMoveType(CustomMoveType.EndPlace))

  const marker = rules?.material(MaterialType.PlaceMarker).player(activePlayer!).getItem()
  const mode = marker?.location.id ?? 0

  if (activePlayer !== playerId) {
    return <>{t('place.opponent', { player: activePlayerName })}</>
  }

  return <>
    {mode === 0 && t('place.first')}
    {mode === 1 && t('place.color')}
    {mode === 2 && t('place.value')}
    {endPlaceMove && <>&nbsp;<PlayMoveButton move={endPlaceMove}>{t('place.end')}</PlayMoveButton></>}
  </>
}
