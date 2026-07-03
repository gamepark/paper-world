/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialType } from '@gamepark/paper-world/material/MaterialType'
import { PlayMoveButton } from '@gamepark/react-game'
import { MaterialItem, MaterialMoveBuilder } from '@gamepark/rules-api'

type Props = { type: MaterialType; item: MaterialItem; image?: string }

export const MaterialChip = ({ type, item, image }: Props) => {
  if (!image) return null
  return (
    <PlayMoveButton
      move={MaterialMoveBuilder.displayMaterialHelp(type, item)}
      transient
      css={chipCss}
    >
      <img src={image} alt="" css={imgCss} />
    </PlayMoveButton>
  )
}

const chipCss = css`
  display: inline-block;
  width: 1.6em;
  height: 1.6em;
  border-radius: 0.2em;
  margin: 0 0.15em;
  vertical-align: -0.4em;
  overflow: hidden;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: 0 0.05em 0.2em rgba(0, 0, 0, 0.4);
  cursor: pointer;

  &:hover {
    transform: scale(1.08);
    opacity: 1 !important;
  }
`

const imgCss = css`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`
