import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { landscapeCardDescription } from './LandScapeCardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.LandscapeCard]: landscapeCardDescription
}
