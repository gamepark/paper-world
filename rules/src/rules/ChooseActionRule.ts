import { CustomMove, isMoveItemType, isCustomMoveType, ItemMove, MaterialItem, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapeValue, hasScissors, Landscape } from '../material/Landscape'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType, TakeByColorData, TakeByValueData } from '../material/CustomMoveType'
import { Memory } from '../material/Memory'
import { RuleId } from './RuleId'
import { advancedDiscardWouldHelp, consumeAdvancedSkip, getAdvancedMaxSkip, getSkipLevel, getValidSpots, getStackHeight } from './helpers/PlacementHelper'

export class ChooseActionRule extends PlayerTurnRule {
  // rotation du marker idle (mode de base): 0=saut disponible, 1=saut en attente
  // rotation du marker idle (mode avancé): nombre de cartes défaussées en attente d'un saut
  get skipPending(): boolean {
    const marker = this.material(MaterialType.PlaceMarker).player(this.player).getItem()
    return (marker?.location.rotation ?? 0) === 1
  }

  get advancedMode(): boolean {
    return !!this.remind(Memory.AdvancedMode)
  }

  get pendingDiscards(): number {
    const marker = this.material(MaterialType.PlaceMarker).player(this.player).getItem()
    return marker?.location.rotation ?? 0
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
    // Réinitialise le saut à chaque début de tour
    const marker = this.material(MaterialType.PlaceMarker).player(this.player).getItem()
    const moves: MaterialMove[] = []
    if ((marker?.location.rotation ?? 0) !== 0) {
      moves.push(
        this.material(MaterialType.PlaceMarker).player(this.player)
          .moveItem({ type: LocationType.PlaceState, player: this.player, x: 0, rotation: 0 })
      )
    }
    if (this.advancedMode) this.forget(Memory.ScissorsDiscountUsed, this.player)
    return moves
  }

  getPlayerMoves(): MaterialMove[] {
    const pendingCard = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PendingTake)
      .getItem()

    if (pendingCard) {
      const value = getLandscapeValue(pendingCard.id as Landscape)
      const color = getLandscapeColor(pendingCard.id as Landscape)
      return [
        this.customMove(CustomMoveType.TakeByValue, { value } as TakeByValueData),
        this.customMove(CustomMoveType.TakeByColor, { color } as TakeByColorData)
      ]
    }

    const moves: MaterialMove[] = []

    // Take moves
    for (let pileId = 0; pileId < 5; pileId++) {
      const topCard = this.material(MaterialType.LandscapeCard)
        .location(LocationType.Pile)
        .locationId(pileId)
        .maxBy(item => item.location.x ?? 0)
      if (!topCard.getItem()) continue
      moves.push(topCard.moveItem({ type: LocationType.PendingTake, id: pileId }))
    }

    // Place moves
    const blocked = this.getBlockedPositions()
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape)
      .player(this.player)
      .getItems()
    const handItems = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand)
      .player(this.player)
      .getItems()

    const maxSkip = this.advancedMode
      ? getAdvancedMaxSkip(this.pendingDiscards, this.playerHasToken(), this.discountUsed)
      : (this.skipPending || this.playerHasToken() ? 1 : 0)

    const seenIds = new Set<number>()
    for (const handItem of handItems) {
      const cardId = handItem.id as Landscape
      if (seenIds.has(cardId)) continue
      seenIds.add(cardId)
      for (const [x, y] of getValidSpots(cardId, panorama, blocked, maxSkip)) {
        const stackHeight = getStackHeight(x, y, panorama)
        moves.push(
          this.material(MaterialType.LandscapeCard)
            .id(cardId).location(LocationType.PlayerHand).player(this.player)
            .moveItem({ type: LocationType.Landscape, player: this.player, x, y, id: stackHeight })
        )
      }
    }

    if (this.advancedMode) {
      moves.push(...this.buildAdvancedDiscardForSkipMoves(maxSkip))
    } else {
      // Défausse pour saut (seulement si pas de saut en attente/gratuit)
      const hasFreeSkip = this.playerHasToken() && !this.skipPending
      if (!this.skipPending && !hasFreeSkip) {
        moves.push(...this.buildDiscardForSkipMoves())
      }
    }

    return moves
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.LandscapeCard)(move)) return []

    // Activation du saut par défausse
    if (move.location.type === LocationType.Discard) {
      const rotation = this.advancedMode ? this.pendingDiscards + 1 : 1
      return [
        this.material(MaterialType.PlaceMarker).player(this.player)
          .moveItem({ type: LocationType.PlaceState, player: this.player, x: 0, rotation })
      ]
    }

    if (move.location.type !== LocationType.Landscape) return []

    const card = this.material(MaterialType.LandscapeCard).getItem(move.itemIndex)
    if (!card) return []
    const color = getLandscapeColor(card.id as Landscape)
    const value = getLandscapeValue(card.id as Landscape)

    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()

    const isScissors = hasScissors(card.id as Landscape)
    const nextRule = isScissors ? RuleId.TakeScissors : RuleId.PlaceCard

    if (isScissors) this.memorize(Memory.LastScissorsCardIndex, move.itemIndex)

    let newRotation: number
    if (this.advancedMode) {
      const skipLevel = getSkipLevel(card.id as Landscape, move.location.x!, move.location.y!, move.location.id as number, panorama)
      const result = consumeAdvancedSkip(this.pendingDiscards, this.discountUsed, skipLevel, this.playerHasToken())
      if (result.discountUsed !== this.discountUsed) this.memorize(Memory.ScissorsDiscountUsed, true, this.player)
      newRotation = result.pendingDiscards
    } else {
      // Détecter si le saut a été utilisé (N+2)
      const skipWasAvailable = this.skipPending || this.playerHasToken()
      const skipWasUsed = skipWasAvailable && getSkipLevel(card.id as Landscape, move.location.x!, move.location.y!, move.location.id as number, panorama) > 0
      // rotation pour PlaceCardRule: 0=dispo, 1=en attente (si défausse faite mais N+2 pas encore posé), 2=épuisé
      newRotation = skipWasUsed ? 2 : (this.skipPending ? 1 : 0)
    }

    return [
      this.material(MaterialType.PlaceMarker).player(this.player)
        .moveItem({ type: LocationType.PlaceState, player: this.player, x: color, y: value, id: 0, rotation: newRotation }),
      this.startPlayerTurn(nextRule, this.player)
    ]
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

  private buildDiscardForSkipMoves(): MaterialMove[] {
    if (this.playerHasToken()) return []

    const blocked = this.getBlockedPositions()
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()
    const handItems = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand).player(this.player).getItems()

    const skipWouldHelp = handItems.some(handItem => {
      const cardId = handItem.id as Landscape
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

    if (!advancedDiscardWouldHelp(handItems, panorama, blocked, maxSkip)) return []

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

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (isCustomMoveType(CustomMoveType.TakeByValue)(move)) {
      const { value } = move.data as TakeByValueData
      return [...this.takePendingAndMatchingTopCards(item => getLandscapeValue(item.id as Landscape) === value), this.startPlayerTurn(RuleId.DiscardToLimit, this.player)]
    }

    if (isCustomMoveType(CustomMoveType.TakeByColor)(move)) {
      const { color } = move.data as TakeByColorData
      return [...this.takePendingAndMatchingTopCards(item => getLandscapeColor(item.id as Landscape) === color), this.startPlayerTurn(RuleId.DiscardToLimit, this.player)]
    }

    return []
  }

  private takePendingAndMatchingTopCards(matches: (item: { id: Landscape }) => boolean): MaterialMove[] {
    const moves: MaterialMove[] = []

    const pendingCardMaterial = this.material(MaterialType.LandscapeCard).location(LocationType.PendingTake)
    const originPileId = pendingCardMaterial.getItem()?.location.id as number | undefined
    moves.push(...pendingCardMaterial.moveItems({ type: LocationType.PlayerHand, player: this.player }))

    for (let pileId = 0; pileId < 5; pileId++) {
      if (pileId === originPileId) continue
      const topCardMaterial = this.material(MaterialType.LandscapeCard)
        .location(LocationType.Pile)
        .locationId(pileId)
        .maxBy(item => item.location.x ?? 0)
      const topCard = topCardMaterial.getItem()
      if (!topCard || !matches(topCard as { id: Landscape })) continue
      moves.push(topCardMaterial.moveItem({ type: LocationType.PlayerHand, player: this.player }))
    }

    return moves
  }
}
