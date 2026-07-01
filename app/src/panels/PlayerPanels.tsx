import { usePlayers } from '@gamepark/react-game'
import { createPortal } from 'react-dom'
import { PaperWorldPlayerPanel } from './PaperWorldPlayerPanel'

export const PlayerPanels = () => {
  const players = usePlayers<number>({ sortFromMe: true })
  const root = document.getElementById('root')
  if (!root) return null

  return createPortal(
    <>
      {players.map((player, index) => (
        <PaperWorldPlayerPanel key={player.id} player={player} index={index} />
      ))}
    </>,
    root
  )
}
