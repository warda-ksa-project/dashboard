export enum Roles {
  admin="Admin",
  trader="Trader"
}

export enum RoleId { 
  admin=1,
  trader=2
}
export interface MenuItem {
  icon: string;
  id: string;
  label: string;
  route: string;
  type: Roles[];
}
export const menuItems  : MenuItem[] =
  [
    { icon: 'pi pi-home',id:'dashboard', label: 'side_bar.dashboard', route: '/dashboard-admin',type:[Roles.admin] },
    { icon: 'pi pi-home', id:'dashboard',label: 'side_bar.dashboard', route: '/dashboard-trader',type:[Roles.trader] },
    { icon: 'pi pi-truck', id:'main category',label: 'side_bar.main_category', route: '/main_category',type:[Roles.admin] },
    { icon: 'pi pi-hashtag', id:'sub categories',label: 'side_bar.sub_category', route: '/sub-category',type:[Roles.admin]  },
    { icon: 'pi pi-gauge', id:'piece products',label: 'side_bar.products', route: '/product',type:[Roles.admin,Roles.trader]  },
    { icon: 'pi pi-crown', id:'products',label: 'side_bar.piece_products', route: '/piece-product',type:[Roles.admin,Roles.trader]  },
    { icon: 'pi pi-list', id:'article',label: 'side_bar.article', route: '/article',type:[Roles.admin] },
    { icon: 'pi pi-globe', id:'countries',label: 'side_bar.country', route: '/country',type:[Roles.admin] },
    { icon: 'pi pi-building', id:'cities',label: 'side_bar.city', route: '/city',type:[Roles.admin]  },
    { icon: 'pi pi-bullseye', id:'traders',label: 'side_bar.trader', route: '/traders',type:[Roles.admin]  },
    { icon: 'pi pi-users', id:'requests',label: 'side_bar.trader_request', route: '/traderRequest',type:[Roles.admin]  },
    { icon: 'pi pi-phone', id:'contact us',label: 'side_bar.contact', route: '/contact-us',type:[Roles.admin]  },
    { icon: 'pi pi-folder', id:'faqs',label: 'side_bar.faqs', route: '/faqs',type:[Roles.admin]  },
    { icon: 'pi pi-truck', id:'orders',label: 'side_bar.orders', route: '/orders' ,type:[Roles.admin,Roles.trader] },
    { icon: 'pi pi-asterisk', id:'order status',label: 'side_bar.orderStatus', route: '/orderStatus' ,type:[Roles.admin] },
    { icon: 'pi pi-times', id:'cancelreason',label: 'side_bar.reason', route: '/cancel-reason',type:[Roles.admin] },
    { icon: 'pi pi-credit-card', id:'payment way',label: 'side_bar.payment', route: '/paymentWay',type:[Roles.admin]  },
    { icon: 'pi pi-images', id:'slider',label: 'side_bar.slider', route: '/slider',type:[Roles.admin]  },
    { icon: 'pi pi-chart-bar', id:'target',label: 'side_bar.target', route: '/target',type:[Roles.trader]  },
    { icon: 'pi pi-users', id:'users',label: 'side_bar.users', route: '/users',type:[Roles.admin]  },
    { icon: 'pi pi-bell', id:'notifications',label: 'side_bar.notifications', route: '/settings/add_notification',type:[Roles.admin] },
    { icon: 'pi pi-database', id:'aboutus',label: 'side_bar.about', route: '/about-us',type:[Roles.admin,Roles.trader] },
    { icon: 'pi pi-file-edit', id:'termsandconditions',label: 'side_bar.termsAndConditions', route: '/settings/terms_conditions' ,type:[Roles.admin] },
    { icon: 'pi pi-shield', id:'privacypolicy',label: 'side_bar.privacyPolicy', route: '/settings/privacy_policy' ,type:[Roles.admin] },
    { icon: 'pi pi-share-alt', id:'socialmedia',label: 'side_bar.socialMedia', route: '/settings/social_media' ,type:[Roles.admin] },
    { icon: 'pi pi-share-alt', id:'socialmedia_trader',label: 'side_bar.socialMedia', route: '/social_media' ,type:[Roles.trader] },
    { icon: 'pi pi-shield', id:'privacypolicy',label: 'side_bar.privacyPolicy', route: '/privacy_policy' ,type:[Roles.trader] },
    { icon: 'pi pi-file-edit', id:'termsandconditions',label: 'side_bar.termsAndConditions', route: '/terms_conditions' ,type:[Roles.trader] },
    { icon: 'pi pi-folder', id:'faqs',label: 'side_bar.faqs', route: '/faqs',type:[Roles.trader]  },



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

