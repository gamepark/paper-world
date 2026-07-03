import { css } from '@emotion/react'
import { usePlayers } from '@gamepark/react-game'
import { TABLE_X_MIN, TABLE_Y_MIN } from '../locators/TableLayout'
import { getPanelScale, getPanelX, PANEL_ROW_Y } from './PanelPosition'
import { PaperWorldPlayerPanel } from './PaperWorldPlayerPanel'

export const PlayerPanels = () => {
  const players = usePlayers<number>({ sortFromMe: true })
  const playerCount = players.length

  return (
    <>
      {players.map((player, index) => {
        const scale = getPanelScale(index, playerCount)
        const x = getPanelX(index, playerCount)
        return (
          <div key={player.id} css={positionCss(x, PANEL_ROW_Y)}>
            <div css={scaleCss(scale)}>
              <PaperWorldPlayerPanel player={player} />
            </div>
          </div>
        )
      })}
    </>
  )
}

// Origin offset matches the framework's default item placement
// (items live in a coordinate system whose (0, 0) sits at left:-xMin, top:-yMin of the table).
// Panels are anchored by their bottom edge (translate ..., -100%) so the row sits
// flush above the bottom of the table regardless of each panel's actual height.
// Position and scale are kept on separate elements: em-based left/top/translate3d
// values resolve against the element's OWN font-size, so putting font-size and
// position on the same node would make each panel's offset shrink by its own scale.
const positionCss = (x: number, y: number) => css`
  position: absolute;
  left: ${-TABLE_X_MIN}em;
  top: ${-TABLE_Y_MIN}em;
  transform: translate(-50%, -100%) translate3d(${x}em, ${y}em, 0);
  z-index: 50;
`

const scaleCss = (scale: number) => css`
  font-size: ${scale}em;
`
