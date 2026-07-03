import { getLandscapeStars, Landscape } from '@gamepark/paper-world/material/Landscape'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { getOccupiedPositions, getTopCard } from '@gamepark/paper-world/rules/helpers/PlacementHelper'
import { Player } from '@gamepark/react-client'
import { StyledPlayerPanel, useRules } from '@gamepark/react-game'
import { CSSProperties, FC, HTMLAttributes } from 'react'
import starImage from '../images/star.png'
import { getPlayerColor } from '../theme/colors'

type Props = { player: Player } & HTMLAttributes<HTMLDivElement>

export const PaperWorldPlayerPanel: FC<Props> = ({ player, ...rest }) => {
  const rules = useRules<PaperWorldRules>()
  const stars = rules ? getPanoramaStars(player.id as number, rules) : 0

  return (
    <StyledPlayerPanel
      player={player}
      activeRing
      style={{ '--pw-player-color': getPlayerColor(player.id as number) } as CSSProperties}
      mainCounter={{ image: starImage, value: stars }}
      {...rest}
    />
  )
}

function getPanoramaStars(player: number, rules: PaperWorldRules): number {
  const panorama = rules.material(MaterialType.LandscapeCard)
    .location(LocationType.Landscape)
    .player(player)
    .getItems()
  return [...getOccupiedPositions(panorama)].reduce((sum, key) => {
    const [x, y] = key.split(',').map(Number)
    const top = getTopCard(x, y, panorama)
    return sum + (top ? getLandscapeStars(top.id as Landscape) : 0)
  }, 0)
}
