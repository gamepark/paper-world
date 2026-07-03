import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'

export const DiscardSkipLog = ({ context }: MoveComponentProps<MaterialMove>) => {
  const player = usePlayerName(context.game.rule?.player)
  return <Trans i18nKey="log.discard.skip" values={{ player }} />
}
