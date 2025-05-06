import { DeckLocator } from '@gamepark/react-game'

class LandscapePileLocator extends DeckLocator {
  coordinates = { x: 0, y: 0 }
}

export const landscapePileLocator = new LandscapePileLocator()
