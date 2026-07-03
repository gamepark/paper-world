import { css } from '@emotion/react'
import { defaultTheme, GameTheme } from '@gamepark/react-game'
import { cardColors, colors } from './colors'
import { fontBody, fontDisplay } from './typography'

const dialogContainer = css`
  border-radius: 0.6em;
  box-shadow:
    0 0 0 0.12em ${colors.amber},
    0 0.6em 1.5em rgba(0, 0, 0, 0.45);

  h2, h3 {
    font-family: ${fontDisplay};
    letter-spacing: 0.02em;
  }

  h2 { color: ${colors.amberDeep}; }
  h3 { color: ${colors.ink}; }

  b, strong { color: ${colors.amberDeep}; }
`

const buttonBase = css`
  background: ${colors.ink} !important;
  color: ${colors.paper} !important;
  border: 0.15em solid ${colors.amber} !important;
  border-radius: 0.5em !important;
  padding: 0.4em 1em !important;
  font-family: ${fontDisplay};
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 0.2em 0.3em rgba(0, 0, 0, 0.25);
  transition: background 150ms ease, color 150ms ease, transform 120ms ease;
  outline: none !important;

  &:hover:not(:disabled),
  &:focus:hover:not(:disabled) {
    background: ${colors.amber} !important;
    color: ${colors.ink} !important;
  }

  &:focus:not(:hover):not(:disabled) {
    background: ${colors.ink} !important;
    color: ${colors.paper} !important;
    border-color: ${colors.gold} !important;
  }

  &:active:not(:disabled) {
    background: ${colors.amberDeep} !important;
    color: ${colors.paper} !important;
    transform: translateY(0.05em);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const headerBar = css`
  background: rgba(30, 27, 24, 0.92);
  border-bottom: 0.15em solid ${colors.amber};
  color: ${colors.paper};
  font-family: ${fontDisplay};
  box-shadow: 0 0.2em 0.4em rgba(0, 0, 0, 0.4);

  h1 {
    color: ${colors.paper};
    font-weight: 600;
  }

  b, strong {
    color: ${colors.gold};
  }
`

const headerButtons = css`
  background: transparent !important;
  color: ${colors.paper} !important;
  border: 0.08em solid ${colors.paper} !important;
  border-radius: 0.4em !important;
  font-family: ${fontDisplay};
  font-weight: 600;
  cursor: pointer;
  padding: 0 0.45em !important;
  letter-spacing: 0.02em;
  box-shadow: none !important;
  outline: none !important;
  transition: background 150ms ease, color 150ms ease;

  &:hover:not(:disabled),
  &:focus:hover:not(:disabled) {
    background: ${colors.paper} !important;
    color: ${colors.ink} !important;
  }

  &:focus:not(:hover):not(:disabled) {
    background: transparent !important;
    color: ${colors.gold} !important;
  }

  &:active:not(:disabled) {
    background: ${colors.amber} !important;
    color: ${colors.ink} !important;
  }
`

const journalHistoryEntry = css`
  background-color: ${colors.paperSoft} !important;
  border: 0.08em solid ${colors.paperDeep} !important;
  border-left: 0.3em solid ${colors.amber} !important;
  border-radius: 0.4em !important;
  color: ${colors.ink} !important;
  font-family: ${fontBody} !important;
  font-size: 1.05em !important;
  padding: 0.55em 0.8em 0.55em 0.9em !important;
  margin: 0.35em 0 !important;
  box-sizing: border-box !important;
  box-shadow: 0 0.15em 0.3em rgba(0, 0, 0, 0.15) !important;

  strong, b { color: ${colors.amberDeep}; font-weight: 700; }
  a { color: ${cardColors.blue}; font-weight: 600; }
`

const menuPanel = css`
  background: ${colors.paper};
  color: ${colors.ink};
  border: 0.05em solid ${colors.paperDeep};
  border-radius: 0.5em;
  box-shadow:
    0 0 0 0.1em rgba(240, 147, 14, 0.4),
    0 0.6em 1.5em rgba(0, 0, 0, 0.45);
  font-family: ${fontDisplay};

  h2 {
    color: ${colors.ink};
    border-bottom: 0.15em solid ${colors.amber};
    padding-bottom: 0.3em;
  }
`

const menuMainButton = css`
  background: ${colors.amber} !important;
  color: ${colors.ink} !important;
  border: 0.15em solid ${colors.ink} !important;
  outline: none !important;

  &:hover:not(:disabled) {
    background: ${colors.amberDeep} !important;
    color: ${colors.paper} !important;
  }

  &:focus:not(:hover):not(:disabled) {
    background: ${colors.amber} !important;
    color: ${colors.ink} !important;
  }
`

// --pw-player-color is set per-panel (see PaperWorldPlayerPanel.tsx) to the player's
// Landscape suit color (Yellow/Blue/Green/Black), falling back to amber if unset.
// Mixed with the paper tone (rather than transparent) so the background stays opaque
// and the panel content (name badge, counters) remains legible over any table area.
const playerPanelPanel = css`
  background-color: color-mix(in srgb, var(--pw-player-color, ${colors.amber}) 80%, ${colors.paperSoft});
  border: 0.15em solid var(--pw-player-color, ${colors.amber});
  box-shadow: 0 0 0 0.08em rgba(0, 0, 0, 0.15), 0 0.25em 0.5em rgba(0, 0, 0, 0.35);
`

const playerPanelDataBadge = css`
  background-color: ${colors.ink} !important;
  color: ${colors.paper} !important;
`

const tutorialContainer = css`
  font-family: ${fontBody};
  color: ${colors.ink};
  background: ${colors.paper};

  h2, h3 {
    font-family: ${fontDisplay};
    color: ${colors.amberDeep};
  }

  strong, b { color: ${colors.amberDeep}; }
`

export const theme: GameTheme = {
  ...defaultTheme,
  root: {
    ...defaultTheme.root,
    fontFamily: fontBody
  },
  palette: {
    primary: colors.amber,
    primaryHover: colors.gold,
    primaryActive: colors.amberDeep,
    primaryLight: colors.paper,
    primaryLighter: colors.paperSoft,
    surface: colors.paper,
    onSurface: colors.ink,
    onSurfaceFocus: colors.paperSoft,
    onSurfaceActive: colors.paperDeep,
    danger: colors.red,
    dangerHover: colors.redLight,
    dangerActive: colors.redDeep,
    disabled: '#8A8378'
  },
  buttons: buttonBase,
  dialog: {
    ...defaultTheme.dialog,
    backgroundColor: colors.paper,
    color: colors.ink,
    container: dialogContainer,
    buttons: buttonBase
  },
  journal: {
    ...(defaultTheme.journal ?? {}),
    historyEntry: journalHistoryEntry
  },
  header: {
    bar: headerBar,
    buttons: headerButtons
  },
  menu: {
    panel: menuPanel,
    mainButton: menuMainButton
  },
  playerPanel: {
    activeRingColors: [cardColors.yellow, cardColors.blue],
    panel: playerPanelPanel,
    dataBadge: playerPanelDataBadge
  },
  tutorial: {
    container: tutorialContainer
  }
}
