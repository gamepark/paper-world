import { getScoreTokenValue, ScoreToken } from '@gamepark/paper-world/material/ScoreToken'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Trans, useTranslation } from 'react-i18next'

export const ScoreTokenHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const id = item?.id as ScoreToken | undefined
  const value = id !== undefined ? getScoreTokenValue(id) : undefined

  return (
    <>
      <h2><Trans i18nKey="help.scoreToken.title" /></h2>
      {value !== undefined && <p>{t('help.scoreToken.value', { count: value })}</p>}
      <p><Trans i18nKey="help.scoreToken.desc" /></p>
    </>
  )
}
