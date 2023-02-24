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
const removeSpecialCharacter = (str: string) =>
  str.replace(
    // eslint-disable-next-line no-useless-escape
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ''
  )
export const rateSale = (original: number, discountPrice: number) =>
  Math.round(((original - discountPrice) / original) * 100) + '%'

export const generateURL = (name: string, id: string) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i,${id}`
}

export const getIdFromURL = (url: string) => {
  const arr = url.split('-i,')
  return arr[arr.length - 1]
}
