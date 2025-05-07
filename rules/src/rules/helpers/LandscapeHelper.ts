import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export class LandscapeHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly player: number
  ) {
    super(game)
  }

  get panorama() {
    console.log(this.material(MaterialType.LandscapeCard).location(LocationType.Landscape).player(this.player))
    return this.material(MaterialType.LandscapeCard).location(LocationType.Landscape).player(this.player)
  }

  get boundaries() {
    const panorama = this.panorama
    return {
      xMin: panorama.minBy((item) => item.location.x!).getItem()?.location.x ?? 0,
      xMax: panorama.maxBy((item) => item.location.x!).getItem()?.location.x ?? 0,
      yMin: panorama.minBy((item) => item.location.y!).getItem()?.location.y ?? 0,
      yMax: panorama.maxBy((item) => item.location.y!).getItem()?.location.y ?? 0
    }
  }
}
