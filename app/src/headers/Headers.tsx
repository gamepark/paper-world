import { RuleId } from '@gamepark/paper-world/rules/RuleId'
import { ComponentType } from 'react'
import { ChooseActionHeader } from './ChooseActionHeader'
import { DiscardHeader } from './DiscardHeader'
import { PlaceCardHeader } from './PlaceCardHeader'
import { TakeScissorsHeader } from './TakeScissorsHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.ChooseAction]: ChooseActionHeader,
  [RuleId.PlaceCard]: PlaceCardHeader,
  [RuleId.DiscardToLimit]: DiscardHeader,
  [RuleId.TakeScissors]: TakeScissorsHeader
}
