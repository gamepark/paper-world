import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { MaterialHelpProps, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const ScissorsTokenHelp = (_props: MaterialHelpProps) => {
  const rules = useRules<PaperWorldRules>()
  const advancedMode = !!rules?.isAdvancedMode()

  return (
    <>
      <h2><Trans i18nKey="help.scissors.title" /></h2>
      <p><Trans i18nKey="help.scissors.get" /></p>

      <h3><Trans i18nKey="help.scissors.bonus.title" /></h3>
      <p><Trans i18nKey={advancedMode ? 'help.scissors.bonus.desc.advanced' : 'help.scissors.bonus.desc'} /></p>

      <h3><Trans i18nKey="help.scissors.malus.title" /></h3>
      <p><Trans i18nKey="help.scissors.malus.desc" /></p>

      <p><Trans i18nKey="help.scissors.score" /></p>
    </>
  )
}
