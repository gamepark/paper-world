import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { MaterialLogProps } from '@gamepark/react-game'
import { isMoveItemType, MaterialItem } from '@gamepark/rules-api'

export function getTakenCards(context: MaterialLogProps['context']): MaterialItem[] {
  const rules = new PaperWorldRules(context.game)
  const cards: MaterialItem[] = []
  for (const consequence of context.action.consequences) {
    if (!isMoveItemType(MaterialType.LandscapeCard)(consequence)) continue
    if (consequence.location.type !== LocationType.PlayerHand) continue
    const item = rules.material(MaterialType.LandscapeCard).getItem(consequence.itemIndex)
    const revealedId = consequence.reveal?.id ?? item?.id
    if (item && revealedId !== undefined) cards.push({ ...item, id: revealedId })
  }
  return cards
}
