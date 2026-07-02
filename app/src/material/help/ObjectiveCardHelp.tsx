import { MaterialHelpProps } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const ObjectiveCardHelp = (_props: MaterialHelpProps) => (
  <>
    <h2><Trans i18nKey="help.objective.title" /></h2>
    <p><Trans i18nKey="help.objective.desc" /></p>
    <p><Trans i18nKey="help.objective.tokens" /></p>
  </>
)
