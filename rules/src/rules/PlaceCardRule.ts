import { CustomMove, isMoveItemType, isCustomMoveType, ItemMove, MaterialItem, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapeValue, hasScissors, Landscape } from '../material/Landscape'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from '../material/CustomMoveType'
import { Memory } from '../material/Memory'
import { RuleId } from './RuleId'
import { consumeAdvancedSkip, getAdvancedMaxSkip, getSkipLevel, getValidSpots, getStackHeight } from './helpers/PlacementHelper'

export class PlaceCardRule extends PlayerTurnRule {
  get marker() {
    return this.material(MaterialType.PlaceMarker).player(this.player).getItem()!
  }

  get firstColor(): number { return this.marker.location.x! }
  get firstValue(): number { return this.marker.location.y! }
  get mode(): number { return this.marker.location.id ?? 0 }
  // rotation (mode de base): 0=saut disponible, 1=saut en attente (payé par défausse), 2=saut épuisé ce tour
  // rotation (mode avancé): nombre de cartes défaussées en attente d'un saut
  get skipPending(): boolean { return (this.marker.location.rotation ?? 0) === 1 }
  get skipExhausted(): boolean { return (this.marker.location.rotation ?? 0) === 2 }
  get pendingDiscards(): number { return this.marker.location.rotation ?? 0 }

  get advancedMode(): boolean {
    return !!this.remind(Memory.AdvancedMode)
  }

  get discountUsed(): boolean {
    return !!this.remind(Memory.ScissorsDiscountUsed, this.player)
  }

  private playerHasToken(): boolean {
    return this.material(MaterialType.ScissorsToken)
      .location(LocationType.ScissorsTokenPlayerSpot)
      .player(this.player)
      .getItem() !== undefined
  }

  onRuleStart(): MaterialMove[] {
    const canContinue = this.advancedMode
      ? this.canContinueAdvanced(this.mode, this.pendingDiscards)
      : this.canContinue(this.mode)
    if (!canContinue) {
      return this.endPlacementMoves()
    }
    return []
  }

  getPlayerMoves(): MaterialMove[] {
    const moves: MaterialMove[] = [this.customMove(CustomMoveType.EndPlace, {})]

    if (this.advancedMode) {
      const maxSkip = getAdvancedMaxSkip(this.pendingDiscards, this.playerHasToken(), this.discountUsed)
      moves.push(...this.buildPlacementMoves(this.mode, maxSkip))
      moves.push(...this.buildAdvancedDiscardForSkipMoves(maxSkip))
      return moves
    }

    const hasFreeSkip = this.playerHasToken() && !this.skipPending && !this.skipExhausted
    const skipAvailable = this.skipPending || hasFreeSkip

    moves.push(...this.buildPlacementMoves(this.mode, skipAvailable ? 1 : 0))

    if (!this.skipPending && !this.skipExhausted && !hasFreeSkip) {
      moves.push(...this.buildDiscardForSkipMoves())
    }

    return moves
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.LandscapeCard)(move)) return []

    // Activation du saut par défausse
    if (move.location.type === LocationType.Discard) {
      const rotation = this.advancedMode ? this.pendingDiscards + 1 : 1
      return [this.markerMove(this.mode, rotation)]
    }

    if (move.location.type !== LocationType.Landscape) return []

    const card = this.material(MaterialType.LandscapeCard).getItem(move.itemIndex)
    if (!card) return []

    const moves: MaterialMove[] = []

    const isScissors = hasScissors(card.id as Landscape)

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

    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()

    let newRotation: number
    if (this.advancedMode) {
      const skipLevel = getSkipLevel(card.id as Landscape, move.location.x!, move.location.y!, move.location.id as number, panorama)
      const result = consumeAdvancedSkip(this.pendingDiscards, this.discountUsed, skipLevel, this.playerHasToken())
      if (result.discountUsed !== this.discountUsed) this.memorize(Memory.ScissorsDiscountUsed, true, this.player)
      newRotation = result.pendingDiscards
    } else {
      const skipWasAvailable = this.skipPending || (this.playerHasToken() && !this.skipExhausted)
      const skipUsed = skipWasAvailable && getSkipLevel(card.id as Landscape, move.location.x!, move.location.y!, move.location.id as number, panorama) > 0
      newRotation = skipUsed ? 2 : (this.marker.location.rotation ?? 0)
    }

    const modeOrRotationChanged = newMode !== this.mode || newRotation !== (this.marker.location.rotation ?? 0)

    // If scissors card placed, let TakeScissorsRule handle the token decision
    if (isScissors) {
      this.memorize(Memory.LastScissorsCardIndex, move.itemIndex)
      if (modeOrRotationChanged) moves.push(this.markerMove(newMode, newRotation))
      moves.push(this.startPlayerTurn(RuleId.TakeScissors, this.player))
      return moves
    }

    const canContinue = this.advancedMode
      ? this.canContinueAdvanced(newMode, newRotation)
      : this.canContinue(newMode, new Set(), newRotation)

    if (!canContinue) {
      return [...moves, ...this.endPlacementMoves()]
    }

    if (modeOrRotationChanged) moves.push(this.markerMove(newMode, newRotation))
    return moves
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (isCustomMoveType(CustomMoveType.EndPlace)(move)) {
      return this.endPlacementMoves()
    }
    return []
  }

  private getBlockedPositions(): Set<string> {
    const blocked = new Set<string>()
    const token = this.material(MaterialType.ScissorsToken)
      .location(LocationType.ScissorsTokenPlayerSpot)
      .player(this.player)
      .getItem()
    const card = token?.location.id !== undefined
      ? this.material(MaterialType.LandscapeCard).getItem(token.location.id as number)
      : undefined
    if (card?.location.x !== undefined && card?.location.y !== undefined) {
      blocked.add(`${card.location.x},${card.location.y}`)
    }
    return blocked
  }

  private canContinue(mode: number, extraBlocked: Set<string> = new Set(), nextRotation = this.marker.location.rotation ?? 0): boolean {
    const blocked = new Set([...this.getBlockedPositions(), ...extraBlocked])
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()
    const handItems = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand).player(this.player).getItems()

    const canSkip = nextRotation === 1
      || (this.playerHasToken() && nextRotation === 0)
      || (nextRotation === 0 && handItems.length >= 2)

    const seenIds = new Set<number>()
    for (const handItem of handItems) {
      const cardId = handItem.id as Landscape
      if (seenIds.has(cardId)) continue
      seenIds.add(cardId)
      if (!this.matchesFilter(cardId, mode)) continue
      const normalSpots = getValidSpots(cardId, panorama, blocked, 0)
      if (normalSpots.length > 0) return true
      if (canSkip) {
        const skipSpots = getValidSpots(cardId, panorama, blocked, 1)
        if (skipSpots.length > normalSpots.length) return true
      }
    }
    return false
  }

  private canContinueAdvanced(mode: number, nextPendingDiscards: number): boolean {
    const blocked = this.getBlockedPositions()
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()
    const handItems = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand).player(this.player).getItems()

    const maxSkip = getAdvancedMaxSkip(nextPendingDiscards, this.playerHasToken(), this.discountUsed)

    const seenIds = new Set<number>()
    for (const handItem of handItems) {
      const cardId = handItem.id as Landscape
      if (seenIds.has(cardId)) continue
      seenIds.add(cardId)
      if (!this.matchesFilter(cardId, mode)) continue
      if (getValidSpots(cardId, panorama, blocked, maxSkip).length > 0) return true
      // Une défausse de plus (si le joueur a encore des cartes à défausser) pourrait débloquer un saut
      if (getValidSpots(cardId, panorama, blocked, maxSkip + 1).length > 0) return true
    }
    return false
  }

  private buildPlacementMoves(mode: number, maxSkip: number): MaterialMove[] {
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
      for (const [x, y] of getValidSpots(cardId, panorama, blocked, maxSkip)) {
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

  private buildDiscardForSkipMoves(): MaterialMove[] {
    if (this.playerHasToken()) return []  // Saut gratuit déjà disponible via le jeton

    const blocked = this.getBlockedPositions()
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()
    const handItems = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand).player(this.player).getItems()

    const skipWouldHelp = handItems.some(handItem => {
      const cardId = handItem.id as Landscape
      if (!this.matchesFilter(cardId, this.mode)) return false
      const normal = getValidSpots(cardId, panorama, blocked, 0)
      const withSkip = getValidSpots(cardId, panorama, blocked, 1)
      return withSkip.length > normal.length
    })

    if (!skipWouldHelp) return []

    return this.discardHandMoves(handItems)
  }

  private buildAdvancedDiscardForSkipMoves(maxSkip: number): MaterialMove[] {
    const blocked = this.getBlockedPositions()
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()
    const handItems = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand).player(this.player).getItems()

    const skipWouldHelp = handItems.some(handItem => {
      const cardId = handItem.id as Landscape
      if (!this.matchesFilter(cardId, this.mode)) return false
      const current = getValidSpots(cardId, panorama, blocked, maxSkip)
      const withOneMore = getValidSpots(cardId, panorama, blocked, maxSkip + 1)
      return withOneMore.length > current.length
    })

    if (!skipWouldHelp) return []

    return this.discardHandMoves(handItems)
  }

  private discardHandMoves(handItems: MaterialItem[]): MaterialMove[] {
    const moves: MaterialMove[] = []
    const seenIds = new Set<number>()
    for (const handItem of handItems) {
      const cardId = handItem.id as Landscape
      if (seenIds.has(cardId)) continue
      seenIds.add(cardId)
      moves.push(
        this.material(MaterialType.LandscapeCard)
          .id(cardId).location(LocationType.PlayerHand).player(this.player)
          .moveItem({ type: LocationType.Discard, player: this.player })
      )
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

  private markerMove(mode: number, rotation = 0): MaterialMove {
    return this.material(MaterialType.PlaceMarker).player(this.player)
      .moveItem({ type: LocationType.PlaceState, player: this.player, x: this.firstColor, y: this.firstValue, id: mode, rotation })
  }

  private endPlacementMoves(): MaterialMove[] {
    return [
      this.material(MaterialType.PlaceMarker).player(this.player)
        .moveItem({ type: LocationType.PlaceState, player: this.player, x: 0, rotation: 0 }),
      this.startPlayerTurn(RuleId.DiscardToLimit, this.player)
    ]
  }
}
