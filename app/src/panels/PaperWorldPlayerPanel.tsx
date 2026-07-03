import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { ScoreHelper } from '@gamepark/paper-world/rules/helpers/ScoreHelper'
import { Player } from '@gamepark/react-client'
import { StyledPlayerPanel, useRules } from '@gamepark/react-game'
import { CSSProperties, FC, HTMLAttributes } from 'react'
import starImage from '../images/star.png'
import { getPlayerColor } from '../theme/colors'

type Props = { player: Player } & HTMLAttributes<HTMLDivElement>

export const PaperWorldPlayerPanel: FC<Props> = ({ player, ...rest }) => {
  const rules = useRules<PaperWorldRules>()
  const score = rules ? new ScoreHelper(rules.game).getScore(player.id as number) : 0

  return (
    <StyledPlayerPanel
      player={player}
      activeRing
      style={{ '--pw-player-color': getPlayerColor(player.id as number) } as CSSProperties}
      mainCounter={{ image: starImage, value: score }}
      {...rest}
    />
  )
}
