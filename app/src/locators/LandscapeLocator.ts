import { Locator } from '@gamepark/react-game'

class LandscapeLocator extends Locator {
  coordinates = { x: 0, y: 15 }
}

export const landscapeLocator = new LandscapeLocator()
