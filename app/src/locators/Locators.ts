import { LandscapeColor } from '@gamepark/paper-world/material/Landscape'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { Locator } from '@gamepark/react-game'
import { landscapeLocator } from './LandscapeLocator'
import { landscapePileLocator } from './LandscapePileLocator'
import { objectivesSpotLocator } from './ObjectivesSpotLocator'
import { playerHandLocator } from './PlayerHandLocator'
import { scissorsTokenSpotLocator } from './ScissorsTokenSpotLocator'
import { scoreTokenSpotLocator } from './ScoreTokenSpotLocator'

export const Locators: Partial<Record<LocationType, Locator<LandscapeColor, MaterialType, LocationType>>> = {
  [LocationType.Pile]: landscapePileLocator,
  [LocationType.Landscape]: landscapeLocator,
  [LocationType.ObjectivesSpot]: objectivesSpotLocator,
  [LocationType.PlayerHand]: playerHandLocator,
  [LocationType.ScoreTokensSpot]: scoreTokenSpotLocator,
  [LocationType.ScissorsTokenSpot]: scissorsTokenSpotLocator
}
