import { MaterialGameSetup } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapes, getLandscapeValue, Landscape, LandscapeColor } from './material/Landscape'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { getRandomObjectives } from './material/Objectives'
import { scoreToken } from './material/ScoreToken'
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
    this.setupObjectives()
    this.setupScissorsToken()
    // TODO
  }

  setupLandscapes() {
    const landscapes = getLandscapes(this.players.length)
    this.material(MaterialType.LandscapeCard).createItems(
      landscapes.map((landscape) => ({
        id: landscape,
        location: { type: LocationType.Pile, id: Math.floor(Math.random() * 5) }
      }))
    )
    for (const player of this.players) {
      this.material(MaterialType.LandscapeCard)
        .id<Landscape>((landscape) => getLandscapeValue(landscape) === 1 && getLandscapeColor(landscape) === player)
        .moveItem({ type: LocationType.Landscape, player, x: 0, y: 0 })
    }
    this.material(MaterialType.LandscapeCard).location(LocationType.Pile).shuffle()
  }

  setupObjectives() {
    const objectives = getRandomObjectives()
    this.material(MaterialType.ObjectiveCard).createItems(
      objectives.map((objective, index) => ({ id: objective, location: { type: LocationType.ObjectivesSpot, id: index } }))
    )
    for (let i = 0; i < 3; i++) {
      this.material(MaterialType.ScoreToken).createItems(scoreToken.map((token) => ({ id: token, location: { type: LocationType.ScoreTokensSpot, id: i } })))
    }
  }

  setupScissorsToken() {
    this.material(MaterialType.ScissorsToken).createItem({ location: { type: LocationType.ScissorsTokenSpot } })
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}
