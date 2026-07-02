import { TokenDescription } from '@gamepark/react-game'
import { ScissorsTokenHelp } from './help/ScissorsTokenHelp'

import ScissorsToken from '../images/tokens/Scissors.jpg'

class ScissorsTokenDescription extends TokenDescription {
  width = 3
  height = 3
  borderRadius = 50

  image = ScissorsToken

  help = ScissorsTokenHelp
}

export const scissorsTokenDescription = new ScissorsTokenDescription()
