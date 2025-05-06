import { TokenDescription } from '@gamepark/react-game'

import ScissorsToken from '../images/tokens/Scissors.jpg'

class ScissorsTokenDescription extends TokenDescription {
  width = 3
  height = 3
  borderRadius = 50

  image = ScissorsToken
}

export const scissorsTokenDescription = new ScissorsTokenDescription()
