import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { landscapeCardDescription } from './LandScapeCardDescription'
import { scissorsTokenDescription } from './ScissorsTokenDescription'
import { scoreTokenDescription } from './ScoreTokenDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.LandscapeCard]: landscapeCardDescription,
  [MaterialType.ScoreToken]: scoreTokenDescription,
  [MaterialType.ScissorsToken]: scissorsTokenDescription
}
