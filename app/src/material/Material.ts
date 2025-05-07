import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { frenchObjectiveCardDescription } from './FrenchObjectiveCardDescription'
import { landscapeCardDescription } from './LandScapeCardDescription'
import { objectiveCardDescription } from './ObjectiveCardDescription'
import { scissorsTokenDescription } from './ScissorsTokenDescription'
import { scoreTokenDescription } from './ScoreTokenDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.LandscapeCard]: landscapeCardDescription,
  [MaterialType.ObjectiveCard]: objectiveCardDescription,
  [MaterialType.ScoreToken]: scoreTokenDescription,
  [MaterialType.ScissorsToken]: scissorsTokenDescription
}

export const materialI18n: Record<string, Partial<Record<MaterialType, MaterialDescription>>> = {
  fr: {
    [MaterialType.ObjectiveCard]: frenchObjectiveCardDescription
  }
}
