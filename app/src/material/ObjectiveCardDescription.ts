import { Objectives } from '@gamepark/paper-world/material/Objectives'
import { CardDescription } from '@gamepark/react-game'

import Objective01 from '../images/objectives/Objective01.jpg'
import Objective02 from '../images/objectives/Objective02.jpg'
import Objective03 from '../images/objectives/Objective03.jpg'
import Objective04 from '../images/objectives/Objective04.jpg'
import Objective05 from '../images/objectives/Objective05.jpg'
import Objective06 from '../images/objectives/Objective06.jpg'
import Objective07 from '../images/objectives/Objective07.jpg'
import Objective08 from '../images/objectives/Objective08.jpg'
import Objective09 from '../images/objectives/Objective09.jpg'
import Objective10 from '../images/objectives/Objective10.jpg'
import Objective11 from '../images/objectives/Objective11.jpg'
import Objective12 from '../images/objectives/Objective12.jpg'
import Objective13 from '../images/objectives/Objective13.jpg'
import Objective14 from '../images/objectives/Objective14.jpg'
import Objective15 from '../images/objectives/Objective15.jpg'
import Objective16 from '../images/objectives/Objective16.jpg'
import Objective17 from '../images/objectives/Objective17.jpg'
import Objective18 from '../images/objectives/Objective18.jpg'
import Objective19 from '../images/objectives/Objective19.jpg'
import Objective20 from '../images/objectives/Objective20.jpg'

export class ObjectiveCardDescription extends CardDescription {
  width = 7
  height = 7

  images = {
    [Objectives.LOfSameColor]: Objective01,
    [Objectives.FourCornersWithTheSameValue]: Objective02,
    [Objectives.LOf2s]: Objective03,
    [Objectives.SquareOfDifferentColors]: Objective04,
    [Objectives.NineStacks]: Objective05,
    [Objectives.OneDiagonalOfSameColor]: Objective06,
    [Objectives.OneLineOf3s]: Objective07,
    [Objectives.TwoStacksOf5s]: Objective08,
    [Objectives.OneTwoThreeFourFiveVisible]: Objective09,
    [Objectives.OneColumnWith252]: Objective10,
    [Objectives.OneDiagonalWith234]: Objective11,
    [Objectives.ThreeStacksOf4s]: Objective12,
    [Objectives.FiveStacksOf1s]: Objective13,
    [Objectives.OneLineWithValueOf9]: Objective14,
    [Objectives.OneColumnWithValueOf12]: Objective15,
    [Objectives.ThreeStacksWithScissors]: Objective16,
    [Objectives.SquareOf3]: Objective17,
    [Objectives.SquareOfSameColor]: Objective18,
    [Objectives.CrossOfDifferentValues]: Objective19,
    [Objectives.CrossOfDifferentColors]: Objective20
  }
}

export const objectiveCardDescription = new ObjectiveCardDescription()
