import { RuleId } from '@gamepark/paper-world/rules/RuleId'
import { ComponentType } from 'react'
import { CheckObjectivesHeader } from './CheckObjectivesHeader'
import { ChooseActionHeader } from './ChooseActionHeader'
import { DiscardForSkipHeader } from './DiscardForSkipHeader'
import { DiscardHeader } from './DiscardHeader'
import { PlaceCardHeader } from './PlaceCardHeader'
import { TakeScissorsHeader } from './TakeScissorsHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.ChooseAction]: ChooseActionHeader,
  [RuleId.PlaceCard]: PlaceCardHeader,
  [RuleId.DiscardForSkip]: DiscardForSkipHeader,
  [RuleId.DiscardToLimit]: DiscardHeader,
  [RuleId.TakeScissors]: TakeScissorsHeader,
  [RuleId.CheckObjectives]: CheckObjectivesHeader
}
