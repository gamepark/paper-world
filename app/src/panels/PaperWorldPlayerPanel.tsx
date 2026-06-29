import { css } from '@emotion/react'
import { getLandscapeStars, Landscape, LandscapeColor } from '@gamepark/paper-world/material/Landscape'
import { LocationType } from '@gamepark/paper-world/material/LocationType'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { getOccupiedPositions, getTopCard } from '@gamepark/paper-world/rules/helpers/PlacementHelper'
import { Player } from '@gamepark/react-client'
import { StyledPlayerPanel, useRules } from '@gamepark/react-game'
import { FC, HTMLAttributes } from 'react'
import starImage from '../images/star.png'

type Props = { player: Player; index: number } & HTMLAttributes<HTMLDivElement>

export const PaperWorldPlayerPanel: FC<Props> = ({ player, index, ...rest }) => {
  const rules = useRules<PaperWorldRules>()
  const stars = rules ? getPanoramaStars(player.id as LandscapeColor, rules) : 0

  return (
    <StyledPlayerPanel
      player={player}
      activeRing
      css={panelPosition(index)}
      mainCounter={{ image: starImage, value: stars }}
      {...rest}
    />
  )
}

function getPanoramaStars(player: LandscapeColor, rules: PaperWorldRules): number {
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

const panelPosition = (index: number) => css`
  position: absolute;
  right: 1em;
  top: ${8.5 + index * 16}em;
  width: 28em;
`
