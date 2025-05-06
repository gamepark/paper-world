import { MaterialGameSetup } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapes, getLandscapeValue, Landscape, LandscapeColor } from './material/Landscape'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PaperWorldOptions } from './PaperWorldOptions'
import { PaperWorldRules } from './PaperWorldRules'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class PaperWorldSetup extends MaterialGameSetup<LandscapeColor, MaterialType, LocationType, PaperWorldOptions> {
  Rules = PaperWorldRules

  setupMaterial(_options: PaperWorldOptions) {
    this.setupLandscapes()
    // TODO
  }

  setupLandscapes() {
    const landscapes = getLandscapes(this.players.length)
    this.material(MaterialType.LandscapeCard).createItems(
      landscapes.map((landscape) => ({
        id: landscape,
        location: { type: LocationType.Pile, x: Math.floor(Math.random() * 5) }
      }))
    )
    for (const player of this.players) {
      this.material(MaterialType.LandscapeCard)
        .id<Landscape>((landscape) => getLandscapeValue(landscape) === 1 && getLandscapeColor(landscape) === player)
        .moveItem({ type: LocationType.Landscape, player })
    }
    this.material(MaterialType.LandscapeCard).location(LocationType.Pile).shuffle()
  }

  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}
