import { Landscape } from '@gamepark/paper-world/material/Landscape'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { MaterialItem } from '@gamepark/rules-api'
import { landscapeCardDescription } from '../material/LandScapeCardDescription'
import { MaterialChip } from './MaterialChip'

type Props = { item: MaterialItem }

export const LandscapeCardChip = ({ item }: Props) => (
  <MaterialChip
    type={MaterialType.LandscapeCard}
    item={item}
    image={item.id !== undefined ? landscapeCardDescription.images[item.id as Landscape] : landscapeCardDescription.backImage}
  />
)
