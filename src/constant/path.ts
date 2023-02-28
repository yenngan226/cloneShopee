const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  purchasesHistory: '/user/purchases',
  login: '/login',
  register: '/register',
  productDetail: ':nameID',
  cart: '/cart'
} as const

export default path
