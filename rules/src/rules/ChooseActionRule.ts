import { CustomMove, isMoveItemType, isCustomMoveType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapeValue, hasScissors, Landscape } from '../material/Landscape'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType, TakeByColorData, TakeByValueData } from '../material/CustomMoveType'
import { RuleId } from './RuleId'
import { getValidSpots, getStackHeight, wasSkipUsed } from './helpers/PlacementHelper'

export class ChooseActionRule extends PlayerTurnRule {
  // rotation du marker idle: 0=saut disponible, 1=saut en attente
  get skipPending(): boolean {
    const marker = this.material(MaterialType.PlaceMarker).player(this.player).getItem()
    return (marker?.location.rotation ?? 0) === 1
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
    if ((marker?.location.rotation ?? 0) !== 0) {
      return [
        this.material(MaterialType.PlaceMarker).player(this.player)
          .moveItem({ type: LocationType.PlaceState, player: this.player, x: 0, rotation: 0 })
      ]
    }
    return []
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

    // Saut gratuit via jeton OU saut en attente (défausse faite)
    const hasFreeSkip = this.playerHasToken() && !this.skipPending
    const skipAvailable = this.skipPending || hasFreeSkip

    const seenIds = new Set<number>()
    for (const handItem of handItems) {
      const cardId = handItem.id as Landscape
      if (seenIds.has(cardId)) continue
      seenIds.add(cardId)
      for (const [x, y] of getValidSpots(cardId, panorama, blocked, skipAvailable)) {
        const stackHeight = getStackHeight(x, y, panorama)
        moves.push(
          this.material(MaterialType.LandscapeCard)
            .id(cardId).location(LocationType.PlayerHand).player(this.player)
            .moveItem({ type: LocationType.Landscape, player: this.player, x, y, id: stackHeight })
        )
      }
    }

    // Défausse pour saut (seulement si pas de saut en attente/gratuit)
    if (!this.skipPending && !hasFreeSkip) {
      moves.push(...this.buildDiscardForSkipMoves())
    }

    return moves
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.LandscapeCard)(move)) return []

    // Activation du saut par défausse
    if (move.location.type === LocationType.Discard) {
      return [
        this.material(MaterialType.PlaceMarker).player(this.player)
          .moveItem({ type: LocationType.PlaceState, player: this.player, x: 0, rotation: 1 })
      ]
    }

    if (move.location.type !== LocationType.Landscape) return []

    const card = this.material(MaterialType.LandscapeCard).getItem(move.itemIndex)
    if (!card) return []
    const color = getLandscapeColor(card.id as Landscape)
    const value = getLandscapeValue(card.id as Landscape)

    // Détecter si le saut a été utilisé (N+2)
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()
    const skipWasAvailable = this.skipPending || this.playerHasToken()
    const skipWasUsed = skipWasAvailable && wasSkipUsed(card.id as Landscape, move.location.x!, move.location.y!, move.location.id as number, panorama)
    // rotation pour PlaceCardRule: 0=dispo, 1=en attente (si défausse faite mais N+2 pas encore posé), 2=épuisé
    const newRotation = skipWasUsed ? 2 : (this.skipPending ? 1 : 0)

    const isScissors = hasScissors(card.id as Landscape)
    const nextRule = isScissors ? RuleId.TakeScissors : RuleId.PlaceCard

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
      const normal = getValidSpots(cardId, panorama, blocked, false)
      const withSkip = getValidSpots(cardId, panorama, blocked, true)
      return withSkip.length > normal.length
    })

    if (!skipWouldHelp) return []

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
