import { MaterialGameSetup } from '@gamepark/rules-api'
import { getLandscapes, getStartingLandscape, Landscape } from './material/Landscape'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Memory } from './material/Memory'
import { beginnerObjectives, getRandomObjectives } from './material/Objectives'
import { ScoreToken, scoreToken } from './material/ScoreToken'
import { PaperWorldOptions } from './PaperWorldOptions'
import { PaperWorldRules } from './PaperWorldRules'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class PaperWorldSetup extends MaterialGameSetup<number, MaterialType, LocationType, PaperWorldOptions> {
  Rules = PaperWorldRules

  setupMaterial(options: PaperWorldOptions) {
    if (options.advancedMode) this.memorize(Memory.AdvancedMode, true)
    this.setupLandscapes()
    this.setupObjectives(options)
    this.setupScissorsToken()
    this.setupPlaceMarkers()
    //this.testLocators()
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
      this.material(MaterialType.LandscapeCard).createItem({
        id: getStartingLandscape(player),
        location: { type: LocationType.Landscape, player, x: 0, y: 0 }
      })
    }
    this.material(MaterialType.LandscapeCard).location(LocationType.Pile).shuffle()
  }

  setupObjectives(options: PaperWorldOptions) {
    const objectives = options.firstGame ? beginnerObjectives : getRandomObjectives()
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

  /**
   * Dev-only helper: fills every player's hand, discard, 3x3 landscape and objective
   * spots so the whole table layout can be checked at a glance without playing turns.
   */
  testLocators() {
    const landscapes = getLandscapes(this.players.length)
    let index = 0
    const nextLandscape = () => landscapes[index++ % landscapes.length]

    for (const player of this.players) {
      this.material(MaterialType.LandscapeCard).createItems(
        Array.from({ length: 9 }, () => ({ id: nextLandscape(), location: { type: LocationType.PlayerHand, player } }))
      )

      this.material(MaterialType.LandscapeCard).createItem({
        id: nextLandscape(),
        location: { type: LocationType.Discard, player }
      })

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (x === 0 && y === 0) continue // starting landscape is already there
          // The last cell (1, 1) always gets a scissors-variant card, so the scissors
          // token (below) has a guaranteed spot to sit on for this player.
          const id = x === 1 && y === 1 ? Landscape.YellowScissors1 : nextLandscape()
          this.material(MaterialType.LandscapeCard).createItem({
            id,
            location: { type: LocationType.Landscape, player, x, y }
          })
        }
      }

      this.material(MaterialType.ScissorsToken).createItem({
        location: { type: LocationType.ScissorsTokenPlayerSpot, player }
      })

      for (let i = 0; i < 3; i++) {
        this.material(MaterialType.ScoreToken).createItem({
          id: ScoreToken.ScoreToken1,
          location: { type: LocationType.PlayerScoreSpot, player, id: i }
        })
      }
    }
  }

  start() {
    this.startPlayerTurn(RuleId.ChooseAction, this.players[0])
  }
}
