/** @jsxImportSource @emotion/react */
import { PaperWorldOptionsSpec } from '@gamepark/paper-world/PaperWorldOptions'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { PaperWorldSetup } from '@gamepark/paper-world/PaperWorldSetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { gameAnimations } from './animations/GameAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

ReactDOM.render(
  <StrictMode>
    <GameProvider
      game="paper-world"
      Rules={PaperWorldRules}
      optionsSpec={PaperWorldOptionsSpec}
      GameSetup={PaperWorldSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
    >
      <App />
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
