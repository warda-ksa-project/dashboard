export enum Roles {
  admin="Admin",
  trader="Trader"
}
export const menuItems =
  [
    { icon: 'pi pi-home',id:'dashboard', label: 'side_bar.dashboard', route: '/dashboard-admin',type:[Roles.admin] },
    { icon: 'pi pi-home', id:'dashboard',label: 'side_bar.dashboard', route: '/dashboard-trader',type:[Roles.trader] },
    { icon: 'pi pi-truck', id:'main category',label: 'side_bar.main_category', route: '/main_category',type:[Roles.admin] },
    // { icon: 'pi pi-users', id:'',label: 'side_bar.category', route: '/category' },
    { icon: 'pi pi-hashtag', id:'sub categories',label: 'side_bar.sub_category', route: '/sub-category',type:[Roles.trader]  },
    { icon: 'pi pi-gauge', id:'piece products',label: 'side_bar.products', route: '/product',type:[Roles.trader]  },
    { icon: 'pi pi-crown', id:'products',label: 'side_bar.piece_products', route: '/piece-product',type:[Roles.trader]  },
    { icon: 'pi pi-list', id:'article',label: 'side_bar.article', route: '/article',type:[Roles.admin] },

    // { icon: 'pi pi-truck', id:'',label: 'side_bar.technicals', route: '/technicals' },
    // { icon: 'pi pi-car', id:'',label: 'side_bar.orders', route: '/orders' },
    // { icon: 'pi pi-server', id:'',label: 'side_bar.special_orders', route: '/special-order' },
    // { icon: 'pi pi-folder', id:'',label: 'side_bar.services', route: '/services' },
    // { icon: 'pi pi-shopping-bag', id:'',label: 'side_bar.contract', route: '/contract-type' },
    { icon: 'pi pi-globe', id:'countries',label: 'side_bar.country', route: '/country',type:[Roles.admin] },
    { icon: 'pi pi-building', id:'cities',label: 'side_bar.city', route: '/city',type:[Roles.admin]  },
    { icon: 'pi pi-bullseye', id:'traders',label: 'side_bar.trader', route: '/trader',type:[Roles.admin]  },
    { icon: 'pi pi-users', id:'requests',label: 'side_bar.trader_request', route: '/trader-request',type:[Roles.admin]  },
    { icon: 'pi pi-phone', id:'contact us',label: 'side_bar.contact', route: '/contact-us',type:[Roles.admin]  },
    { icon: 'pi pi-folder', id:'faqs',label: 'side_bar.faqs', route: '/faqs',type:[Roles.admin]  },

    // { icon: 'pi pi-home', id:'',label: 'side_bar.dashboard', route: '/dashboard' },
    // { icon: 'pi pi-users', id:'',label: 'side_bar.clients', route: '/clients' },
    // { icon: 'pi pi-users', id:'',label: 'side_bar.technicals', route: '/technicals' },
    { icon: 'pi pi-truck', id:'orders',label: 'side_bar.orders', route: '/orders' ,type:[Roles.admin,Roles.trader] },
    { icon: 'pi pi-asterisk', id:'order status',label: 'side_bar.orderStatus', route: '/orderStatus' ,type:[Roles.admin] },

    // { icon: 'pi pi-car', id:'',label: 'side_bar.special_orders', route: '/special-order' },
    // { icon: 'pi pi-server', id:'',label: 'side_bar.services', route: '/services' },
    // { icon: 'pi pi-folder', id:'',label: 'side_bar.contract', route: '/contract-type' },
    // { icon: 'pi pi-shopping-bag', id:'',label: 'side_bar.pkg', route: '/package' },
    // { icon: 'pi pi-clock', id:'',label: 'side_bar.working_hours', route: '/working_hours' },
    // { icon: 'pi pi-globe', id:'',label: 'side_bar.country', route: '/country' },
    // { icon: 'pi pi-building', id:'',label: 'side_bar.city', route: '/city' },
    // { icon: 'pi pi-times', id:'',label: 'side_bar.reason', route: '/cancel-reason' },
    // { icon: 'pi pi-book', id:'',label: 'side_bar.complaint', route: '/complaint' },
    // { icon: 'pi pi-qrcode', id:'',label: 'side_bar.copone', route: '/copone' },
    { icon: 'pi pi-credit-card', id:'payment way',label: 'side_bar.payment', route: '/paymentWay',type:[Roles.admin]  },
    { icon: 'pi pi-images', id:'slider',label: 'side_bar.slider', route: '/slider',type:[Roles.admin]  },
    { icon: 'pi pi-chart-bar', id:'target',label: 'side_bar.target', route: '/target',type:[Roles.trader]  },
    { icon: 'pi pi-users', id:'users',label: 'side_bar.users', route: '/users',type:[Roles.admin]  },

    // { icon: 'pi pi-trophy', id:'',label: 'side_bar.technical_sp', route: '/technical-specialist' },
    // { icon: 'pi pi-phone', id:'',label: 'side_bar.contact', route: '/contact-us' },
    // { icon: 'pi pi-database', id:'',label: 'side_bar.about', route: '/about-us' }
  ]


export const sliderViewType = [
  {
    name: 'AdminTool',
    code: 1
  },
  {
    name: 'FrontEnd',
    code: 2
  },
  {
    name: 'Both',
    code: 3
  }
]

export const userType = [
  {
    name: 'Admin',
    nameAr: 'ادمن',
    code: 1
  },
  {
    name: 'Trader',
    nameAr: 'تاجر',
    code: 2
  },
  {
    name: 'Client',
    nameAr: 'عميل',
    code: 3
  },
]

export const coponeOfferTypeList = [
  {
    name: 'Percentage',
    code: 1
  },
  {
    name: 'Amount',
    code: 2
  }
]

export const coponeTypeList = [
  {
    name: 'Gift',
    code: 1
  },
  {
    name: 'Offer',
    code: 2
  }
]

export const PackageTypeList = [
  {
    name: 'Daily',
    code: 1
  },
  {
    name: 'Monthly',
    code: 2
  },
  {
    name: 'Qurater',
    code: 3
  },
  {
    name: 'Biannual',
    code: 4
  },
  {
    name: 'Yearly',
    code: 5
  },
  {
    name: 'Weekly',
    code: 6
  }
]

export const packageHourVistList = [
  {
    name: '4',
    code: 4
  },
  {
    name: '8',
    code: 8
  }
]

export const gender = [
  {
    name: 'Male',
    code: 1
  },
  {
    name: 'Female',
    code: 2
  }
]

export const order_status = [
  { name: 'Pending', id: 0, code: 0, color: '#c1cd6a' },
  { name: 'Paid', id: 1, code: 1, color: '#c1cd6a' },
  { name: 'AssignedToProvider', id: 2, code: 2, color: '#b16acd' },
  { name: 'InTheWay', id: 3, code: 3, color: '#ccc053' },
  { name: 'TryingSolveProblem', id: 4, code: 4, color: '#9b9d9c' },
  { name: 'Solved', id: 5, code: 5, color: '#49e97c' },
  { name: 'ClientConfirmation', id: 6, code: 6, color: '#49e97c' },
  { name: 'Completed', id: 7, code: 7, color: '#49e97c' },
  { name: 'Canceled', id: 8, code: 8, color: '#e94949' }
]
export const special_order_status = [
  { name: 'Pending', id: 1, code: 1, color: '#c1cd6a' },
  { name: 'Completed', id: 2, code: 2, color: '#3fac4e' },
  { name: 'Canceled', id: 3, code: 3, color: '#c32722' }
]

export const special_order_enum = [
  {
    name: 'Emergency',
    code: 1
  },
  {
    name: 'Special',
    code: 2
  }
]


