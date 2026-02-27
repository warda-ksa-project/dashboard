import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { Roles } from './conts';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  
  // ==================== Auth Routes ====================
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
      },
      { 
        path: 'forget_password', 
        loadComponent: () => import('./pages/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent) 
      },
      { 
        path: 'reset_password', 
        loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) 
      },
    ]
  },

  // ==================== Protected Routes ====================
  {
    path: '',
    loadComponent: () => import('./layouts/home-layout/home-layout.component').then(m => m.HomeLayoutComponent),
    canActivate: [authGuard],
    children: [
      // ==================== Dashboards ====================
      { 
        path: 'dashboard-admin', 
        loadComponent: () => import('./pages/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'dashboard-trader', 
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.trader] }
      },

      // ==================== Profile (Both) ====================
      { 
        path: 'profile', 
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      { 
        path: 'profile/edit/:id', 
        loadComponent: () => import('./pages/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
      },

      // ==================== Social Media (Admin & Trader) ====================
      {
        path: 'social_media',
        loadComponent: () => import('./pages/social-media/social-media-update/social-media-update.component').then(m => m.SocialMediaUpdateComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },

      // ==================== Trader-Specific Settings Routes ====================
      // Privacy Policy for Trader
      { 
        path: 'privacy_policy', 
        loadComponent: () => import('./pages/privacy-policy/privacy-policy-table/privacy-policy-table.component').then(m => m.PrivacyPolicyTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.trader] }
      },
    
      { 
        path: 'privacy_policy/view/:id', 
        loadComponent: () => import('./pages/privacy-policy/privacy-policy-details/privacy-policy-details.component').then(m => m.PrivacyPolicyDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.trader] }
      },

      // Terms & Conditions for Trader
      { 
        path: 'terms_conditions', 
        loadComponent: () => import('./pages/terms-conditions/terms-conditions-table/terms-conditions-table.component').then(m => m.TermsConditionsTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.trader] }
      },
      { 
        path: 'terms_conditions/view/:id', 
        loadComponent: () => import('./pages/terms-conditions/terms-conditions-details/terms-conditions-details.component').then(m => m.TermsConditionsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.trader] }
      },

      // ==================== Settings (Admin Only) ====================
      { 
        path: 'settings', 
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] },
        children: [
          // FAQs
          { 
            path: 'faqs', 
            loadComponent: () => import('./pages/fAQs/faqs-table/faqs-table.component').then(m => m.FaqsTableComponent) 
          },
          { 
            path: 'faqs/add', 
            loadComponent: () => import('./pages/fAQs/fags-details/fags-details.component').then(m => m.FagsDetailsComponent) 
          },
          { 
            path: 'faqs/edit/:id', 
            loadComponent: () => import('./pages/fAQs/fags-details/fags-details.component').then(m => m.FagsDetailsComponent) 
          },
          { 
            path: 'faqs/view/:id', 
            loadComponent: () => import('./pages/fAQs/fags-details/fags-details.component').then(m => m.FagsDetailsComponent) 
          },

          // Terms & Conditions
          { 
            path: 'terms_conditions', 
            loadComponent: () => import('./pages/terms-conditions/terms-conditions-table/terms-conditions-table.component').then(m => m.TermsConditionsTableComponent) 
          },
          { 
            path: 'terms_conditions/add', 
            loadComponent: () => import('./pages/terms-conditions/terms-conditions-details/terms-conditions-details.component').then(m => m.TermsConditionsDetailsComponent) 
          },
          { 
            path: 'terms_conditions/edit/:id', 
            loadComponent: () => import('./pages/terms-conditions/terms-conditions-details/terms-conditions-details.component').then(m => m.TermsConditionsDetailsComponent) 
          },
          { 
            path: 'terms_conditions/view/:id', 
            loadComponent: () => import('./pages/terms-conditions/terms-conditions-details/terms-conditions-details.component').then(m => m.TermsConditionsDetailsComponent) 
          },

          // Privacy Policy
          { 
            path: 'privacy_policy', 
            loadComponent: () => import('./pages/privacy-policy/privacy-policy-table/privacy-policy-table.component').then(m => m.PrivacyPolicyTableComponent) 
          },
          { 
            path: 'privacy_policy/add', 
            loadComponent: () => import('./pages/privacy-policy/privacy-policy-details/privacy-policy-details.component').then(m => m.PrivacyPolicyDetailsComponent) 
          },
          { 
            path: 'privacy_policy/edit/:id', 
            loadComponent: () => import('./pages/privacy-policy/privacy-policy-details/privacy-policy-details.component').then(m => m.PrivacyPolicyDetailsComponent) 
          },
          { 
            path: 'privacy_policy/view/:id', 
            loadComponent: () => import('./pages/privacy-policy/privacy-policy-details/privacy-policy-details.component').then(m => m.PrivacyPolicyDetailsComponent) 
          },

          // Social Media
          { 
            path: 'social_media', 
            loadComponent: () => import('./pages/social-media/social-media-update/social-media-update.component').then(m => m.SocialMediaUpdateComponent) 
          },

          // Slider
          { 
            path: 'slider', 
            loadComponent: () => import('./pages/slider/slider-table/slider-table.component').then(m => m.SliderTableComponent) 
          },
          { 
            path: 'slider/add', 
            loadComponent: () => import('./pages/slider/slider-details/slider-details.component').then(m => m.SliderDetailsComponent) 
          },
          { 
            path: 'slider/edit/:id', 
            loadComponent: () => import('./pages/slider/slider-details/slider-details.component').then(m => m.SliderDetailsComponent) 
          },
          { 
            path: 'slider/view/:id', 
            loadComponent: () => import('./pages/slider/slider-details/slider-details.component').then(m => m.SliderDetailsComponent) 
          },

          // Notifications
          { 
            path: 'add_notification', 
            loadComponent: () => import('./pages/add-notifications/add-notifications.component').then(m => m.AddNotificationsComponent) 
          },
        ]
      },

      // ==================== Admin Only Routes ====================
      
      // Main Category
      { 
        path: 'main_category', 
        loadComponent: () => import('./pages/main-category/main-catogory-table/main-catogory-table.component').then(m => m.MainCatogoryTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'main_category/add', 
        loadComponent: () => import('./pages/main-category/main-catogory-details/main-catogory-details.component').then(m => m.MainCatogoryDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'main_category/view/:id', 
        loadComponent: () => import('./pages/main-category/main-catogory-details/main-catogory-details.component').then(m => m.MainCatogoryDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'main_category/edit/:id', 
        loadComponent: () => import('./pages/main-category/main-catogory-details/main-catogory-details.component').then(m => m.MainCatogoryDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // Countries
      { 
        path: 'country', 
        loadComponent: () => import('./pages/countries/countries-table/countries-table.component').then(m => m.CountriesTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'country/add', 
        loadComponent: () => import('./pages/countries/countries-details/countries-details.component').then(m => m.CountriesDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'country/view/:id', 
        loadComponent: () => import('./pages/countries/countries-details/countries-details.component').then(m => m.CountriesDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'country/edit/:id', 
        loadComponent: () => import('./pages/countries/countries-details/countries-details.component').then(m => m.CountriesDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // Cities
      { 
        path: 'city', 
        loadComponent: () => import('./pages/cities/cities-table/cities-table.component').then(m => m.CitiesTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'city/add', 
        loadComponent: () => import('./pages/cities/city-details/city-details.component').then(m => m.CityDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'city/view/:id', 
        loadComponent: () => import('./pages/cities/city-details/city-details.component').then(m => m.CityDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'city/edit/:id', 
        loadComponent: () => import('./pages/cities/city-details/city-details.component').then(m => m.CityDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // Traders
      { 
        path: 'traders', 
        loadComponent: () => import('./pages/traders/trader-table/trader-table.component').then(m => m.TraderTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'traders/add', 
        loadComponent: () => import('./pages/traders/trader-details/trader-details.component').then(m => m.TraderDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'traders/view/:id', 
        loadComponent: () => import('./pages/traders/trader-details/trader-details.component').then(m => m.TraderDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'traders/edit/:id', 
        loadComponent: () => import('./pages/traders/trader-details/trader-details.component').then(m => m.TraderDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // Trader Requests
      { 
        path: 'traderRequest', 
        loadComponent: () => import('./pages/traders/trader-requests-table/trader-requests-table.component').then(m => m.TraderRequestsTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'traderRequest/add', 
        loadComponent: () => import('./pages/traders/trader-requests-details/trader-requests-details.component').then(m => m.TraderRequestsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'traderRequest/view/:id', 
        loadComponent: () => import('./pages/traders/trader-requests-details/trader-requests-details.component').then(m => m.TraderRequestsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'traderRequest/edit/:id', 
        loadComponent: () => import('./pages/traders/trader-requests-details/trader-requests-details.component').then(m => m.TraderRequestsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // Order Status
      { 
        path: 'orderStatus', 
        loadComponent: () => import('./layouts/home-layout/order-status/order-status-table/order-status-table.component').then(m => m.OrderStatusTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'orderStatus/add', 
        loadComponent: () => import('./layouts/home-layout/order-status/order-status-details/order-status-details.component').then(m => m.OrderStatusDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'orderStatus/view/:id', 
        loadComponent: () => import('./layouts/home-layout/order-status/order-status-details/order-status-details.component').then(m => m.OrderStatusDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'orderStatus/edit/:id', 
        loadComponent: () => import('./layouts/home-layout/order-status/order-status-details/order-status-details.component').then(m => m.OrderStatusDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // Articles
      { 
        path: 'article', 
        loadComponent: () => import('./pages/article/article-table/article-table.component').then(m => m.ArticleTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'article/add', 
        loadComponent: () => import('./pages/article/article-details/article-details.component').then(m => m.ArticleDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'article/view/:id', 
        loadComponent: () => import('./pages/article/article-details/article-details.component').then(m => m.ArticleDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'article/edit/:id', 
        loadComponent: () => import('./pages/article/article-details/article-details.component').then(m => m.ArticleDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // Contact Us
      { 
        path: 'contact-us', 
        loadComponent: () => import('./pages/contact-us/contact-us-table/contact-us-table.component').then(m => m.ContactUsTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'contact-us/add', 
        loadComponent: () => import('./pages/contact-us/contact-us-details/contact-us-details.component').then(m => m.ContactUsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'contact-us/view/:id', 
        loadComponent: () => import('./pages/contact-us/contact-us-details/contact-us-details.component').then(m => m.ContactUsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'contact-us/edit/:id', 
        loadComponent: () => import('./pages/contact-us/contact-us-details/contact-us-details.component').then(m => m.ContactUsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // FAQs (Shared: Admin & Trader)
      { 
        path: 'faqs', 
        loadComponent: () => import('./pages/fAQs/faqs-table/faqs-table.component').then(m => m.FaqsTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'faqs/add', 
        loadComponent: () => import('./pages/fAQs/fags-details/fags-details.component').then(m => m.FagsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'faqs/edit/:id', 
        loadComponent: () => import('./pages/fAQs/fags-details/fags-details.component').then(m => m.FagsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'faqs/view/:id', 
        loadComponent: () => import('./pages/fAQs/fags-details/fags-details.component').then(m => m.FagsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },

      // Payment Ways
      { 
        path: 'paymentWay', 
        loadComponent: () => import('./pages/payment-way/payment-way-table/payment-way-table.component').then(m => m.PaymentWayTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'paymentWay/add', 
        loadComponent: () => import('./pages/payment-way/payment-way-details/payment-way-details.component').then(m => m.PaymentWayDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'paymentWay/view/:id', 
        loadComponent: () => import('./pages/payment-way/payment-way-details/payment-way-details.component').then(m => m.PaymentWayDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'paymentWay/edit/:id', 
        loadComponent: () => import('./pages/payment-way/payment-way-details/payment-way-details.component').then(m => m.PaymentWayDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // Slider (Outside Settings)
      { 
        path: 'slider', 
        loadComponent: () => import('./pages/slider/slider-table/slider-table.component').then(m => m.SliderTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'slider/add', 
        loadComponent: () => import('./pages/slider/slider-details/slider-details.component').then(m => m.SliderDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'slider/edit/:id', 
        loadComponent: () => import('./pages/slider/slider-details/slider-details.component').then(m => m.SliderDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'slider/view/:id', 
        loadComponent: () => import('./pages/slider/slider-details/slider-details.component').then(m => m.SliderDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // Users
      { 
        path: 'users', 
        loadComponent: () => import('./pages/users/users-table/users-table.component').then(m => m.UsersTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'user/add', 
        loadComponent: () => import('./pages/users/users-details/users-details.component').then(m => m.UsersDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'user/view/:id', 
        loadComponent: () => import('./pages/users/users-details/users-details.component').then(m => m.UsersDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'user/edit/:id', 
        loadComponent: () => import('./pages/users/users-details/users-details.component').then(m => m.UsersDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

      // ==================== Trader Only Routes ====================
      
      // Sub Categories
      { 
        path: 'sub-category', 
        loadComponent: () => import('./pages/sub-category/sub-category-table/sub-category-table.component').then(m => m.SubCategoryTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.trader] }
      },
      { 
        path: 'sub-category/add', 
        loadComponent: () => import('./pages/sub-category/sub-category-details/sub-category-details.component').then(m => m.SubCategoryDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.trader] }
      },
      { 
        path: 'sub-category/view/:id', 
        loadComponent: () => import('./pages/sub-category/sub-category-details/sub-category-details.component').then(m => m.SubCategoryDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.trader] }
      },
      { 
        path: 'sub-category/edit/:id', 
        loadComponent: () => import('./pages/sub-category/sub-category-details/sub-category-details.component').then(m => m.SubCategoryDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.trader] }
      },

      // Target
      { 
        path: 'target', 
        loadComponent: () => import('./pages/target/target.component').then(m => m.TargetComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.trader] }
      },

      // ==================== Shared Routes (Admin & Trader) ====================
      
      // Products
      { 
        path: 'product', 
        loadComponent: () => import('./pages/products/products-table/products-table.component').then(m => m.ProductsTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'product/add', 
        loadComponent: () => import('./pages/products/products-details/products-details.component').then(m => m.ProductsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'product/view/:id', 
        loadComponent: () => import('./pages/products/products-details/products-details.component').then(m => m.ProductsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'product/edit/:id', 
        loadComponent: () => import('./pages/products/products-details/products-details.component').then(m => m.ProductsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },

      // Piece Products
      { 
        path: 'piece-product', 
        loadComponent: () => import('./pages/piece-products/piece-products-table/piece-products-table.component').then(m => m.PieceProductsTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'piece-product/add', 
        loadComponent: () => import('./pages/piece-products/piece-products-details/piece-products-details.component').then(m => m.PieceProductsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'piece-product/view/:id', 
        loadComponent: () => import('./pages/piece-products/piece-products-details/piece-products-details.component').then(m => m.PieceProductsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'piece-product/edit/:id', 
        loadComponent: () => import('./pages/piece-products/piece-products-details/piece-products-details.component').then(m => m.PieceProductsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },

      // Orders
      { 
        path: 'orders', 
        loadComponent: () => import('./pages/orders/orders-table/orders-table.component').then(m => m.OrdersTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'order/add', 
        loadComponent: () => import('./pages/orders/orders-details/orders-details.component').then(m => m.OrdersDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'order/view/:id', 
        loadComponent: () => import('./pages/orders/orders-details/orders-details.component').then(m => m.OrdersDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'order/edit/:id', 
        loadComponent: () => import('./pages/orders/orders-details/orders-details.component').then(m => m.OrdersDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },

      // ==================== Other Routes (No specific role restrictions) ====================
      
      // Categories
      { 
        path: 'category', 
        loadComponent: () => import('./pages/category/category-table/category-table.component').then(m => m.CategoryTableComponent) 
      },
      { 
        path: 'category/add', 
        loadComponent: () => import('./pages/category/category-details/category-details.component').then(m => m.CategoryDetailsComponent) 
      },
      { 
        path: 'category/view/:id', 
        loadComponent: () => import('./pages/category/category-details/category-details.component').then(m => m.CategoryDetailsComponent) 
      },
      { 
        path: 'category/edit/:id', 
        loadComponent: () => import('./pages/category/category-details/category-details.component').then(m => m.CategoryDetailsComponent) 
      },

      // Cancel Reasons
      { 
        path: 'cancel-reason', 
        loadComponent: () => import('./pages/cancel-reason/cancel-reason-table/cancel-reason-table.component').then(m => m.CancelReasonTableComponent) 
      },
      { 
        path: 'cancel-reason/add', 
        loadComponent: () => import('./pages/cancel-reason/cancel-reason-details/cancel-reason-details.component').then(m => m.CancelReasonDetailsComponent) 
      },
      { 
        path: 'cancel-reason/view/:id', 
        loadComponent: () => import('./pages/cancel-reason/cancel-reason-details/cancel-reason-details.component').then(m => m.CancelReasonDetailsComponent) 
      },
      { 
        path: 'cancel-reason/edit/:id', 
        loadComponent: () => import('./pages/cancel-reason/cancel-reason-details/cancel-reason-details.component').then(m => m.CancelReasonDetailsComponent) 
      },

      // About Us (Shared: Admin & Trader - Trader view only)
      { 
        path: 'about-us', 
        loadComponent: () => import('./pages/about-us/about-us-table/about-us-table.component').then(m => m.AboutUsTableComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'about-us/add', 
        loadComponent: () => import('./pages/about-us/about-us-details/about-us-details.component').then(m => m.AboutUsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },
      { 
        path: 'about-us/view/:id', 
        loadComponent: () => import('./pages/about-us/about-us-details/about-us-details.component').then(m => m.AboutUsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.trader] }
      },
      { 
        path: 'about-us/edit/:id', 
        loadComponent: () => import('./pages/about-us/about-us-details/about-us-details.component').then(m => m.AboutUsDetailsComponent),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] }
      },

    ]
  },
  
  // ==================== Not Found ====================
  { 
    path: '**', 
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) 
  }
];
