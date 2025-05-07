import { Objectives } from '@gamepark/paper-world/material/Objectives'
import { ObjectiveCardDescription } from './ObjectiveCardDescription'

import ObjectiveFR01 from '../images/objectives-fr/ObjectivesFR01.jpg'
import ObjectiveFR02 from '../images/objectives-fr/ObjectivesFR02.jpg'
import ObjectiveFR03 from '../images/objectives-fr/ObjectivesFR03.jpg'
import ObjectiveFR04 from '../images/objectives-fr/ObjectivesFR04.jpg'
import ObjectiveFR05 from '../images/objectives-fr/ObjectivesFR05.jpg'
import ObjectiveFR06 from '../images/objectives-fr/ObjectivesFR06.jpg'
import ObjectiveFR07 from '../images/objectives-fr/ObjectivesFR07.jpg'
import ObjectiveFR08 from '../images/objectives-fr/ObjectivesFR08.jpg'
import ObjectiveFR09 from '../images/objectives-fr/ObjectivesFR09.jpg'
import ObjectiveFR10 from '../images/objectives-fr/ObjectivesFR10.jpg'
import ObjectiveFR11 from '../images/objectives-fr/ObjectivesFR11.jpg'
import ObjectiveFR12 from '../images/objectives-fr/ObjectivesFR12.jpg'
import ObjectiveFR13 from '../images/objectives-fr/ObjectivesFR13.jpg'
import ObjectiveFR14 from '../images/objectives-fr/ObjectivesFR14.jpg'
import ObjectiveFR15 from '../images/objectives-fr/ObjectivesFR15.jpg'
import ObjectiveFR16 from '../images/objectives-fr/ObjectivesFR16.jpg'
import ObjectiveFR17 from '../images/objectives-fr/ObjectivesFR17.jpg'
import ObjectiveFR18 from '../images/objectives-fr/ObjectivesFR18.jpg'
import ObjectiveFR19 from '../images/objectives-fr/ObjectivesFR19.jpg'
import ObjectiveFR20 from '../images/objectives-fr/ObjectivesFR20.jpg'

class FrenchObjectiveCardDescription extends ObjectiveCardDescription {
  images = {
    [Objectives.LOfSameColor]: ObjectiveFR01,
    [Objectives.FourCornersWithTheSameValue]: ObjectiveFR02,
    [Objectives.LOf2s]: ObjectiveFR03,
    [Objectives.SquareOfDifferentColors]: ObjectiveFR04,
    [Objectives.NineStacks]: ObjectiveFR05,
    [Objectives.OneDiagonalOfSameColor]: ObjectiveFR06,
    [Objectives.OneLineOf3s]: ObjectiveFR07,
    [Objectives.TwoStacksOf5s]: ObjectiveFR08,
    [Objectives.OneTwoThreeFourFiveVisible]: ObjectiveFR09,
    [Objectives.OneColumnWith252]: ObjectiveFR10,
    [Objectives.OneDiagonalWith234]: ObjectiveFR11,
    [Objectives.ThreeStacksOf4s]: ObjectiveFR12,
    [Objectives.FiveStacksOf1s]: ObjectiveFR13,
    [Objectives.OneLineWithValueOf9]: ObjectiveFR14,
    [Objectives.OneColumnWithValueOf12]: ObjectiveFR15,
    [Objectives.ThreeStacksWithScissors]: ObjectiveFR16,
    [Objectives.SquareOf3]: ObjectiveFR17,
    [Objectives.SquareOfSameColor]: ObjectiveFR18,
    [Objectives.CrossOfDifferentValues]: ObjectiveFR19,
    [Objectives.CrossOfDifferentColors]: ObjectiveFR20
  }
}

export const frenchObjectiveCardDescription = new FrenchObjectiveCardDescription()
