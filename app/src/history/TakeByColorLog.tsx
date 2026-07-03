import { TakeByColorData } from '@gamepark/paper-world/material/CustomMoveType'
import { MaterialLogProps, usePlayerName } from '@gamepark/react-game'
import { CustomMove } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'
import { getTakenCards } from './getTakenCards'
import { LandscapeCardChip } from './LandscapeCardChip'

export const TakeByColorLog = ({ move, context }: MaterialLogProps<CustomMove>) => {
  const { t } = useTranslation()
  const player = usePlayerName(context.game.rule?.player)
  const { color } = move.data as TakeByColorData
  const cards = getTakenCards(context)

  return (
    <>
      {t('log.take.color', { player, color: t(`log.color.${color}`) })}
      {cards.map((item, index) => <LandscapeCardChip key={index} item={item} />)}
    </>
  )
}
