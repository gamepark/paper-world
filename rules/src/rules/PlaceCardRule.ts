import { CustomMove, isMoveItemType, isCustomMoveType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapeValue, hasScissors, Landscape } from '../material/Landscape'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from '../material/CustomMoveType'
import { RuleId } from './RuleId'
import { getValidSpots, getStackHeight } from './helpers/PlacementHelper'

export class PlaceCardRule extends PlayerTurnRule {
  get marker() {
    return this.material(MaterialType.PlaceMarker).player(this.player).getItem()!
  }

  get firstColor(): number { return this.marker.location.x! }
  get firstValue(): number { return this.marker.location.y! }
  get mode(): number { return this.marker.location.id ?? 0 }

  onRuleStart(): MaterialMove[] {
    if (!this.canContinue(this.mode)) {
      return this.endPlacementMoves()
    }
    return []
  }

  getPlayerMoves(): MaterialMove[] {
    const moves: MaterialMove[] = [this.customMove(CustomMoveType.EndPlace, {})]
    moves.push(...this.buildPlacementMoves(this.mode))
    return moves
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.LandscapeCard)(move)) return []
    if (move.location.type !== LocationType.Landscape) return []

    const card = this.material(MaterialType.LandscapeCard).getItem(move.itemIndex)
    if (!card) return []

    const moves: MaterialMove[] = []
    const isScissors = hasScissors(card.id as Landscape)
    if (isScissors) {
      moves.push(
        this.material(MaterialType.ScissorsToken)
          .moveItem({ type: LocationType.ScissorsTokenLandscapeSpot, player: this.player, x: move.location.x, y: move.location.y })
      )
    }

    let newMode = this.mode
    if (this.mode === 0) {
      const secondColor = getLandscapeColor(card.id as Landscape)
      const secondValue = getLandscapeValue(card.id as Landscape)
      const sameColor = secondColor === this.firstColor
      const sameValue = secondValue === this.firstValue
      if (!(sameColor && sameValue)) {
        newMode = sameValue ? 2 : 1
      }
    }

    // The token hasn't moved yet, so add current position as extra blocked
    const extraBlocked = isScissors ? new Set([`${move.location.x},${move.location.y}`]) : new Set<string>()
    if (!this.canContinue(newMode, extraBlocked)) {
      return [...moves, ...this.endPlacementMoves()]
    }

    if (newMode !== this.mode) {
      return [...moves, this.markerMove(newMode)]
    }

    return moves
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (isCustomMoveType(CustomMoveType.EndPlace)(move)) {
      return this.endPlacementMoves()
    }
    return []
  }

  private getBlockedPositions(): Set<string> {
    const token = this.material(MaterialType.ScissorsToken)
      .location(LocationType.ScissorsTokenLandscapeSpot)
      .getItem()
    if (!token) return new Set()
    return new Set([`${token.location.x},${token.location.y}`])
  }

  private canContinue(mode: number, extraBlocked: Set<string> = new Set()): boolean {
    const blocked = new Set([...this.getBlockedPositions(), ...extraBlocked])
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()
    const handItems = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand).player(this.player).getItems()

    const seenIds = new Set<number>()
    for (const handItem of handItems) {
      const cardId = handItem.id as Landscape
      if (seenIds.has(cardId)) continue
      seenIds.add(cardId)
      if (!this.matchesFilter(cardId, mode)) continue
      if (getValidSpots(cardId, panorama, blocked).length > 0) return true
    }
    return false
  }

  private buildPlacementMoves(mode: number): MaterialMove[] {
    const moves: MaterialMove[] = []
    const blocked = this.getBlockedPositions()
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()
    const handItems = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand).player(this.player).getItems()

    const seenIds = new Set<number>()
    for (const handItem of handItems) {
      const cardId = handItem.id as Landscape
      if (seenIds.has(cardId)) continue
      seenIds.add(cardId)
      if (!this.matchesFilter(cardId, mode)) continue
      for (const [x, y] of getValidSpots(cardId, panorama, blocked)) {
        const stackHeight = getStackHeight(x, y, panorama)
        moves.push(
          this.material(MaterialType.LandscapeCard)
            .id(cardId).location(LocationType.PlayerHand).player(this.player)
            .moveItem({ type: LocationType.Landscape, player: this.player, x, y, id: stackHeight })
        )
      }
    }
    return moves
  }

  private matchesFilter(cardId: Landscape, mode: number): boolean {
    const cardColor = getLandscapeColor(cardId)
    const cardValue = getLandscapeValue(cardId)
    return mode === 0 ? cardColor === this.firstColor || cardValue === this.firstValue
      : mode === 1 ? cardColor === this.firstColor
      : cardValue === this.firstValue
  }

  private markerMove(mode: number): MaterialMove {
    return this.material(MaterialType.PlaceMarker).player(this.player)
      .moveItem({ type: LocationType.PlaceState, player: this.player, x: this.firstColor, y: this.firstValue, id: mode, rotation: 0 })
  }

  private endPlacementMoves(): MaterialMove[] {
    return [
      this.material(MaterialType.PlaceMarker).player(this.player)
        .moveItem({ type: LocationType.PlaceState, player: this.player, x: 0, rotation: 0 }),
      this.startPlayerTurn(RuleId.DiscardToLimit, this.player)
    ]
  }
}
