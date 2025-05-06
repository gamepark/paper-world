import { MaterialGame, MaterialMove, MaterialRules, StackingStrategy, TimeLimit } from '@gamepark/rules-api'
import { LandscapeColor } from './material/Landscape'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { TheFirstStepRule } from './rules/TheFirstStepRule'
import { RuleId } from './rules/RuleId'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class PaperWorldRules
  extends MaterialRules<LandscapeColor, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<LandscapeColor, MaterialType, LocationType>, MaterialMove<LandscapeColor, MaterialType, LocationType>, LandscapeColor>
{
  rules = {
    [RuleId.TheFirstStep]: TheFirstStepRule
  }

  locationsStrategies = {
    [MaterialType.LandscapeCard]: {
      [LocationType.Pile]: new StackingStrategy()
    }
  }

  giveTime(): number {
    return 60
  }
}
