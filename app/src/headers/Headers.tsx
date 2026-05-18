import { RuleId } from '@gamepark/paper-world/rules/RuleId'
import { ComponentType } from 'react'
import { ChooseActionHeader } from './ChooseActionHeader'
import { DiscardHeader } from './DiscardHeader'
import { PlaceCardHeader } from './PlaceCardHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.ChooseAction]: ChooseActionHeader,
  [RuleId.PlaceCard]: PlaceCardHeader,
  [RuleId.DiscardToLimit]: DiscardHeader
}
