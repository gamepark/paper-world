import { ScoreToken } from '@gamepark/paper-world/material/ScoreToken'
import { TokenDescription } from '@gamepark/react-game'

import ScoreToken1 from '../images/tokens/ScoreToken1.jpg'
import ScoreToken2 from '../images/tokens/ScoreToken2.jpg'
import ScoreToken4 from '../images/tokens/ScoreToken4.jpg'

class ScoreTokenDescription extends TokenDescription {
  width = 2.5
  height = 2.5
  borderRadius = 50

  images = {
    [ScoreToken.ScoreToken1]: ScoreToken1,
    [ScoreToken.ScoreToken2]: ScoreToken2,
    [ScoreToken.ScoreToken4]: ScoreToken4
  }
}

export const scoreTokenDescription = new ScoreTokenDescription()
