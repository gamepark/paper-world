import { PaperWorldOptionsSpec } from '@gamepark/paper-world/PaperWorldOptions'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { PaperWorldSetup } from '@gamepark/paper-world/PaperWorldSetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { PaperWorldLogs } from './history/PaperWorldLogs'
import { Locators } from './locators/Locators'
import { Material, materialI18n } from './material/Material'
import { scoring } from './Scoring'

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
      scoring={scoring}
      logs={new PaperWorldLogs()}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
