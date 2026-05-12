import { PaperWorldOptionsSpec } from '@gamepark/paper-world/PaperWorldOptions'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { PaperWorldSetup } from '@gamepark/paper-world/PaperWorldSetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { Material, materialI18n } from './material/Material'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="paper-world"
      Rules={PaperWorldRules}
      optionsSpec={PaperWorldOptionsSpec}
      GameSetup={PaperWorldSetup}
      material={Material}
      materialI18n={materialI18n}
      locators={Locators}
      animations={gameAnimations}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
