import { MaterialGameSetup } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapes, getLandscapeValue, Landscape, LandscapeColor } from './material/Landscape'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { getRandomObjectives } from './material/Objectives'
import { ScoreToken, scoreToken } from './material/ScoreToken'
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
    this.setupPlaceMarkers()
    // TODO
  }

  setupLandscapes() {
    const landscapes = getLandscapes(this.players.length)
    let index = 0

    this.material(MaterialType.LandscapeCard).createItems(
      landscapes.map((landscape) => {
        const pileId = index % 5
        index++
        return {
          id: landscape,
          location: { type: LocationType.Pile, id: pileId }
        }
      })
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
    const tokens = this.players.length === 2 ? scoreToken.filter((token) => token !== ScoreToken.ScoreToken4) : scoreToken
    for (let i = 0; i < 3; i++) {
      this.material(MaterialType.ScoreToken).createItems(tokens.map((token) => ({ id: token, location: { type: LocationType.ScoreTokensSpot, id: i } })))
    }
  }

  setupScissorsToken() {
    this.material(MaterialType.ScissorsToken).createItem({ location: { type: LocationType.ScissorsTokenSpot } })
  }

  setupPlaceMarkers() {
    for (const player of this.players) {
      this.material(MaterialType.PlaceMarker).createItem({
        location: { type: LocationType.PlaceState, player, x: 0 }
      })
    }
  }

  start() {
    this.startPlayerTurn(RuleId.ChooseAction, this.players[0])
  }
}
