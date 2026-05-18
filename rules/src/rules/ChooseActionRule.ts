import { CustomMove, isMoveItemType, isCustomMoveType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { getLandscapeColor, getLandscapeValue, hasScissors, Landscape } from '../material/Landscape'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType, TakeByColorData, TakeByValueData } from '../material/CustomMoveType'
import { RuleId } from './RuleId'
import { getValidSpots, getStackHeight } from './helpers/PlacementHelper'

export class ChooseActionRule extends PlayerTurnRule {
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

    // Take moves: click pile top card
    for (let pileId = 0; pileId < 5; pileId++) {
      const topCard = this.material(MaterialType.LandscapeCard)
        .location(LocationType.Pile)
        .locationId(pileId)
        .maxBy(item => item.location.x ?? 0)
      if (!topCard.getItem()) continue
      moves.push(topCard.moveItem({ type: LocationType.PendingTake, id: pileId }))
    }

    // Place moves: click hand card to place in panorama
    const panorama = this.material(MaterialType.LandscapeCard)
      .location(LocationType.Landscape)
      .player(this.player)
      .getItems()

    const handItems = this.material(MaterialType.LandscapeCard)
      .location(LocationType.PlayerHand)
      .player(this.player)
      .getItems()

    const blocked = this.getBlockedPositions()
    const seenIds = new Set<number>()
    for (const handItem of handItems) {
      const cardId = handItem.id as Landscape
      if (seenIds.has(cardId)) continue
      seenIds.add(cardId)
      const validSpots = getValidSpots(cardId, panorama, blocked)
      for (const [x, y] of validSpots) {
        const stackHeight = getStackHeight(x, y, panorama)
        moves.push(
          this.material(MaterialType.LandscapeCard)
            .id(cardId)
            .location(LocationType.PlayerHand)
            .player(this.player)
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

    const moves: MaterialMove[] = []
    if (hasScissors(card.id as Landscape)) {
      moves.push(
        this.material(MaterialType.ScissorsToken)
          .moveItem({ type: LocationType.ScissorsTokenLandscapeSpot, player: this.player, x: move.location.x, y: move.location.y })
      )
    }
    moves.push(
      this.material(MaterialType.PlaceMarker)
        .player(this.player)
        .moveItem({ type: LocationType.PlaceState, player: this.player, x: color, y: value, id: 0, rotation: 0 }),
      this.startPlayerTurn(RuleId.PlaceCard, this.player)
    )
    return moves
  }

  private getBlockedPositions(): Set<string> {
    const token = this.material(MaterialType.ScissorsToken)
      .location(LocationType.ScissorsTokenLandscapeSpot)
      .getItem()
    if (!token) return new Set()
    return new Set([`${token.location.x},${token.location.y}`])
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
