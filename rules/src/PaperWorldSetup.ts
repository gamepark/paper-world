import { MaterialGameSetup } from '@gamepark/rules-api'
import { PaperWorldOptions } from './PaperWorldOptions'
import { PaperWorldRules } from './PaperWorldRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerColor } from './PlayerColor'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class PaperWorldSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, PaperWorldOptions> {
  Rules = PaperWorldRules

  setupMaterial(_options: PaperWorldOptions) {
    // TODO
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}
