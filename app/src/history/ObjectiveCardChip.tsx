import { Objectives } from '@gamepark/paper-world/material/Objectives'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { MaterialItem } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'
import { frenchObjectiveCardDescription } from '../material/FrenchObjectiveCardDescription'
import { objectiveCardDescription } from '../material/ObjectiveCardDescription'
import { MaterialChip } from './MaterialChip'

type Props = { item: MaterialItem }

export const ObjectiveCardChip = ({ item }: Props) => {
  const { i18n } = useTranslation()
  const description = i18n.language === 'fr' ? frenchObjectiveCardDescription : objectiveCardDescription
  return (
    <MaterialChip
      type={MaterialType.ObjectiveCard}
      item={item}
      image={item.id !== undefined ? description.images[item.id as Objectives] : undefined}
    />
  )
}
