export const colors = {
  paper: '#F4ECD8',
  paperSoft: '#FAF5E9',
  paperDeep: '#E3D3AC',

  ink: '#1E1B18',
  inkDeep: '#100E0C',

  amber: '#F0930E',
  amberDeep: '#C97509',

  gold: '#F5B400',
  goldDeep: '#C98F00',

  red: '#D3402C',
  redLight: '#E85A45',
  redDeep: '#A82F1F'
}

// The 4 Landscape suits printed on the cards (Yellow/Blue/Green/Black, in the
// same order as the Landscape color ids in rules/src/material/Landscape.ts).
export const cardColors = {
  yellow: '#F0930E',
  blue: '#1E6FD1',
  green: '#4CA82D',
  black: colors.ink
}

// Each player's starting Landscape card carries a color id (1=Yellow, 2=Blue, 3=Green,
// 4=Black, see getStartingLandscape in rules/src/material/Landscape.ts) that also serves
// as their player id, so player id doubles as their card color here.
const playerCardColors = [cardColors.yellow, cardColors.blue, cardColors.green, cardColors.black]
export const getPlayerColor = (playerId: number): string => playerCardColors[playerId - 1] ?? colors.amber
