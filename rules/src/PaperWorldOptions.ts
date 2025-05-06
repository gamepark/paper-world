import { getEnumValues, OptionsSpec } from '@gamepark/rules-api'
import { LandscapeColor } from './material/Landscape'

/**
 * This is the options for each player in the game.
 */
type PlayerOptions = { id: LandscapeColor }

/**
 * This is the type of object that the game receives when a new game is started.
 * The first generic parameter, "{}", can be changed to include game options like variants or expansions.
 */
export type PaperWorldOptions = {
  players: PlayerOptions[]
}

/**
 * This object describes all the options a game can have, and will be used by GamePark website to create automatically forms for you game
 * (forms for friendly games, or forms for matchmaking preferences, for instance).
 */
export const PaperWorldOptionsSpec: OptionsSpec<PaperWorldOptions> = {
  players: {
    id: {
      label: (t) => t('player.id'),
      values: getEnumValues(LandscapeColor),
      valueSpec: (id) => ({ label: (t) => t(`player.${id}`) })
    }
  }
}
