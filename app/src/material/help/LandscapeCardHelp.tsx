import { getLandscapeStars, hasScissors, Landscape } from '@gamepark/paper-world/material/Landscape'
import { PaperWorldRules } from '@gamepark/paper-world/PaperWorldRules'
import { MaterialHelpProps, useRules } from '@gamepark/react-game'
import { Trans, useTranslation } from 'react-i18next'

export const LandscapeCardHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const rules = useRules<PaperWorldRules>()
  const advancedMode = !!rules?.isAdvancedMode()
  const id = item?.id as Landscape | undefined
  const stars = id !== undefined ? getLandscapeStars(id) : undefined

  return (
    <>
      <h2><Trans i18nKey="help.card.title" /></h2>

      {stars !== undefined && <p>{t('help.card.stars', { count: stars })}</p>}
      {id !== undefined && hasScissors(id) && <p><Trans i18nKey="help.card.scissors" /></p>}

      <h3><Trans i18nKey="help.card.take.title" /></h3>
      <p><Trans i18nKey="help.card.take.desc" /></p>

      <h3><Trans i18nKey="help.card.place.title" /></h3>
      <p><Trans i18nKey="help.card.place.desc" /></p>
      <ul>
        <li><Trans i18nKey="help.card.place.rule.grid" /></li>
        <li><Trans i18nKey="help.card.place.rule.adjacent" /></li>
        <li><Trans i18nKey="help.card.place.rule.increasing" /></li>
        <li><Trans i18nKey="help.card.place.rule.forbidden" /></li>
      </ul>

      <h3><Trans i18nKey="help.card.skip.title" /></h3>
      <p><Trans i18nKey="help.card.skip.desc" /></p>
      {advancedMode && <p><Trans i18nKey="help.card.skip.desc.advanced" /></p>}
    </>
  )
}
