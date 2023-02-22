export const currencyExchange = (currency: number) => {
  return new Intl.NumberFormat('de-DE').format(currency)
}
export const formatNumberToSocialType = (number: number) => {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(number)
    .replace('.', ',')
    .toLocaleLowerCase()
}
