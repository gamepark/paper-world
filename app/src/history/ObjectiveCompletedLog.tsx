import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { getScoreTokenValue, ScoreToken } from '@gamepark/paper-world/material/ScoreToken'
import { MaterialLogProps, usePlayerName } from '@gamepark/react-game'
import { MoveItem } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { ObjectiveCardChip } from './ObjectiveCardChip'

export const ObjectiveCompletedLog = ({ move, context }: MaterialLogProps<MoveItem>) => {
  const player = usePlayerName(move.location.player)
  const rules = new PaperWorldRules(context.game)
  const token = rules.material(MaterialType.ScoreToken).getItem(move.itemIndex)
  const points = token?.id !== undefined ? getScoreTokenValue(token.id as ScoreToken) : undefined
  const objective = rules.material(MaterialType.ObjectiveCard)
    .location(LocationType.ObjectivesSpot)
    .locationId(move.location.id as number)
    .getItem()

  return (
    <Trans
      i18nKey="log.objective.completed"
      values={{ player, points }}
      components={{ card: objective ? <ObjectiveCardChip item={objective} /> : <span /> }}
    />
  )
}
