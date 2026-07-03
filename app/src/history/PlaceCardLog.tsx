import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { MaterialLogProps, usePlayerName } from '@gamepark/react-game'
import { MoveItem } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { LandscapeCardChip } from './LandscapeCardChip'

export const PlaceCardLog = ({ move, context }: MaterialLogProps<MoveItem>) => {
  const player = usePlayerName(context.game.rule?.player)
  const item = new PaperWorldRules(context.game).material(MaterialType.LandscapeCard).getItem(move.itemIndex)
  const revealedId = move.reveal?.id ?? item?.id
  const displayItem = item && revealedId !== undefined ? { ...item, id: revealedId } : undefined

  return (
    <Trans
      i18nKey="log.place"
      values={{ player }}
      components={{ card: displayItem ? <LandscapeCardChip item={displayItem} /> : <span /> }}
    />
  )
}
