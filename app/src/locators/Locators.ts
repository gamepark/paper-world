import { LandscapeColor } from '@gamepark/paper-world/material/Landscape'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { Locator } from '@gamepark/react-game'

export const Locators: Partial<Record<LocationType, Locator<LandscapeColor, MaterialType, LocationType>>> = {}
