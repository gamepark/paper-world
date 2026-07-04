import { CustomMove, isMoveItemType, isCustomMoveType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapeValue, hasScissors, Landscape } from '../material/Landscape'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType, TakeByColorData, TakeByValueData } from '../material/CustomMoveType'
import { Memory } from '../material/Memory'
import { RuleId } from './RuleId'
import { getAdvancedJumpBudget, getSkipLevel, getValidSpots, getStackHeight } from './helpers/PlacementHelper'

export class ChooseActionRule extends PlayerTurnRule {
  // rotation du marker idle (mode de base uniquement): 0=saut disponible, 1=saut déjà utilisé ce tour
  get jumpUsedThisTurn(): boolean {
    const marker = this.material(MaterialType.PlaceMarker).player(this.player).getItem()
    return (marker?.location.rotation ?? 0) === 1
  }

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

    const hasToken = this.playerHasToken()
    const maxSkip = this.advancedMode
      ? getAdvancedJumpBudget(handItems.length, hasToken, this.discountUsed)
      : (this.jumpUsedThisTurn ? 0 : (hasToken || handItems.length >= 2 ? 1 : 0))

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

    return moves
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.LandscapeCard)(move)) return []
    if (move.location.type !== LocationType.Landscape) return []

    const card = this.material(MaterialType.LandscapeCard).getItem(move.itemIndex)
    if (!card) return []
    const color = getLandscapeColor(card.id as Landscape)
    const value = getLandscapeValue(card.id as Landscape)

    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape).player(this.player).getItems()

    const isScissors = hasScissors(card.id as Landscape)
    if (isScissors) this.memorize(Memory.LastScissorsCardIndex, move.itemIndex)

    const skipLevel = getSkipLevel(card.id as Landscape, move.location.x!, move.location.y!, move.location.id as number, panorama)
    const hasToken = this.playerHasToken()

    let discardRequired = 0
    let newRotation = 0
    if (this.advancedMode) {
      if (skipLevel > 0) {
        const useDiscount = hasToken && !this.discountUsed
        discardRequired = Math.max(0, skipLevel - (useDiscount ? 1 : 0))
        if (useDiscount) this.memorize(Memory.ScissorsDiscountUsed, true, this.player)
      }
    } else if (skipLevel > 0) {
      discardRequired = hasToken ? 0 : 1
      newRotation = 1
    }

    const moves: MaterialMove[] = [
      this.material(MaterialType.PlaceMarker).player(this.player)
        .moveItem({ type: LocationType.PlaceState, player: this.player, x: color, y: value, id: 0, rotation: newRotation })
    ]

    const nextRule = isScissors ? RuleId.TakeScissors : RuleId.PlaceCard

    if (discardRequired > 0) {
      this.memorize(Memory.SkipDiscardRemaining, discardRequired, this.player)
      this.memorize(Memory.SkipDiscardNextRule, nextRule, this.player)
      moves.push(this.startPlayerTurn(RuleId.DiscardForSkip, this.player))
      return moves
    }

    moves.push(this.startPlayerTurn(nextRule, this.player))
    return moves
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
