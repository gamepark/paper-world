import { Landscape } from '@gamepark/paper-world/material/Landscape'
import { CardDescription } from '@gamepark/react-game'

import Yellow1 from '../images/paper-cards/Yellow1.jpg'
import Yellow2 from '../images/paper-cards/Yellow2.jpg'
import Yellow3 from '../images/paper-cards/Yellow3.jpg'
import Yellow4 from '../images/paper-cards/Yellow4.jpg'
import Yellow5 from '../images/paper-cards/Yellow5.jpg'
import YellowScissors1 from '../images/paper-cards/YellowScissors1.jpg'
import YellowScissors2 from '../images/paper-cards/YellowScissors2.jpg'
import YellowScissors3 from '../images/paper-cards/YellowScissors3.jpg'
import YellowScissors4 from '../images/paper-cards/YellowScissors4.jpg'
import Blue1 from '../images/paper-cards/Blue1.jpg'
import Blue2 from '../images/paper-cards/Blue2.jpg'
import Blue3 from '../images/paper-cards/Blue3.jpg'
import Blue4 from '../images/paper-cards/Blue4.jpg'
import Blue5 from '../images/paper-cards/Blue5.jpg'
import BlueScissors1 from '../images/paper-cards/BlueScissors1.jpg'
import BlueScissors2 from '../images/paper-cards/BlueScissors2.jpg'
import BlueScissors3 from '../images/paper-cards/BlueScissors3.jpg'
import BlueScissors4 from '../images/paper-cards/BlueScissors4.jpg'
import Green1 from '../images/paper-cards/Green1.jpg'
import Green2 from '../images/paper-cards/Green2.jpg'
import Green3 from '../images/paper-cards/Green3.jpg'
import Green4 from '../images/paper-cards/Green4.jpg'
import Green5 from '../images/paper-cards/Green5.jpg'
import GreenScissors1 from '../images/paper-cards/GreenScissors1.jpg'
import GreenScissors2 from '../images/paper-cards/GreenScissors2.jpg'
import GreenScissors3 from '../images/paper-cards/GreenScissors3.jpg'
import GreenScissors4 from '../images/paper-cards/GreenScissors4.jpg'
import Black1 from '../images/paper-cards/Black1.jpg'
import Black2 from '../images/paper-cards/Black2.jpg'
import Black3 from '../images/paper-cards/Black3.jpg'
import Black4 from '../images/paper-cards/Black4.jpg'
import Black5 from '../images/paper-cards/Black5.jpg'
import BlackScissors1 from '../images/paper-cards/BlackScissors1.jpg'
import BlackScissors2 from '../images/paper-cards/BlackScissors2.jpg'
import BlackScissors3 from '../images/paper-cards/BlackScissors3.jpg'
import BlackScissors4 from '../images/paper-cards/BlackScissors4.jpg'

class LandScapeCardDescription extends CardDescription {
  width = 7
  height = 7

  backImage = Yellow1

  images = {
    [Landscape.Yellow1]: Yellow1,
    [Landscape.Yellow2]: Yellow2,
    [Landscape.Yellow3]: Yellow3,
    [Landscape.Yellow4]: Yellow4,
    [Landscape.Yellow5]: Yellow5,
    [Landscape.YellowScissors1]: YellowScissors1,
    [Landscape.YellowScissors2]: YellowScissors2,
    [Landscape.YellowScissors3]: YellowScissors3,
    [Landscape.YellowScissors4]: YellowScissors4,
    [Landscape.Blue1]: Blue1,
    [Landscape.Blue2]: Blue2,
    [Landscape.Blue3]: Blue3,
    [Landscape.Blue4]: Blue4,
    [Landscape.Blue5]: Blue5,
    [Landscape.BlueScissors1]: BlueScissors1,
    [Landscape.BlueScissors2]: BlueScissors2,
    [Landscape.BlueScissors3]: BlueScissors3,
    [Landscape.BlueScissors4]: BlueScissors4,
    [Landscape.Green1]: Green1,
    [Landscape.Green2]: Green2,
    [Landscape.Green3]: Green3,
    [Landscape.Green4]: Green4,
    [Landscape.Green5]: Green5,
    [Landscape.GreenScissors1]: GreenScissors1,
    [Landscape.GreenScissors2]: GreenScissors2,
    [Landscape.GreenScissors3]: GreenScissors3,
    [Landscape.GreenScissors4]: GreenScissors4,
    [Landscape.Black1]: Black1,
    [Landscape.Black2]: Black2,
    [Landscape.Black3]: Black3,
    [Landscape.Black4]: Black4,
    [Landscape.Black5]: Black5,
    [Landscape.BlackScissors1]: BlackScissors1,
    [Landscape.BlackScissors2]: BlackScissors2,
    [Landscape.BlackScissors3]: BlackScissors3,
    [Landscape.BlackScissors4]: BlackScissors4
  }
}

export const landscapeCardDescription = new LandScapeCardDescription()
