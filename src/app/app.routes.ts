import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './core/auth.guard';
import { FaqsTableComponent } from './pages/fAQs/faqs-table/faqs-table.component';
import { FagsDetailsComponent } from './pages/fAQs/fags-details/fags-details.component';
import { CountriesDetailsComponent } from './pages/countries/countries-details/countries-details.component';
import { WorkingHoursTableComponent } from './pages/working-hours/working-hours-table/working-hours-table.component';
import { WorkingHoursDetailsComponent } from './pages/working-hours/working-hours-details/working-hours-details.component';
import { CountriesTableComponent } from './pages/countries/countries-table/countries-table.component';
import { CityDetailsComponent } from './pages/cities/city-details/city-details.component';
import { CitiesTableComponent } from './pages/cities/cities-table/cities-table.component';
import { CancelReasonTableComponent } from './pages/cancel-reason/cancel-reason-table/cancel-reason-table.component';
import { CancelReasonDetailsComponent } from './pages/cancel-reason/cancel-reason-details/cancel-reason-details.component';
import { ComplaintTableComponent } from './pages/complaint/complaint-table/complaint-table.component';
import { ComplaintDetailsComponent } from './pages/complaint/complaint-details/complaint-details.component';
import { ContractTypeTableComponent } from './pages/contract-type/contract-type-table/contract-type-table.component';
import { ContractTypeDetailsComponent } from './pages/contract-type/contract-type-details/contract-type-details.component';
import { CoponeTableComponent } from './pages/copone/copone-table/copone-table.component';
import { CoponeDetailsComponent } from './pages/copone/copone-details/copone-details.component';
import { TermsConditionsTableComponent } from './pages/terms-conditions/terms-conditions-table/terms-conditions-table.component';
import { TermsConditionsDetailsComponent } from './pages/terms-conditions/terms-conditions-details/terms-conditions-details.component';
import { PrivacyPolicyTableComponent } from './pages/privacy-policy/privacy-policy-table/privacy-policy-table.component';
import { PrivacyPolicyDetailsComponent } from './pages/privacy-policy/privacy-policy-details/privacy-policy-details.component';
import { PaymentWayTableComponent } from './pages/payment-way/payment-way-table/payment-way-table.component';
import { PaymentWayDetailsComponent } from './pages/payment-way/payment-way-details/payment-way-details.component';
import { ServicesTableComponent } from './pages/services/services-table/services-table.component';
import { ServicesDetailsComponent } from './pages/services/services-details/services-details.component';
import { ClientTableComponent } from './pages/clients/client-table/client-table.component';
import { ClientDetailsComponent } from './pages/clients/client-details/client-details.component';
import { PackageTableComponent } from './pages/package/package-table/package-table.component';
import { PackageDetailsComponent } from './pages/package/package-details/package-details.component';
import { TechnicalSpecialistTableComponent } from './pages/technical-specialist/technical-specialist-table/technical-specialist-table.component';
import { TechnicalSpecialistDetailsComponent } from './pages/technical-specialist/technical-specialist-details/technical-specialist-details.component';
import { SocialMediaUpdateComponent } from './pages/social-media/social-media-update/social-media-update.component';
import { OrdersTableComponent } from './pages/orders/orders-table/orders-table.component';
import { OrdersDetailsComponent } from './pages/orders/orders-details/orders-details.component';
import { SliderTableComponent } from './pages/slider/slider-table/slider-table.component';
import { SliderDetailsComponent } from './pages/slider/slider-details/slider-details.component';
import { ContactUsTableComponent } from './pages/contact-us/contact-us-table/contact-us-table.component';
import { ContactUsDetailsComponent } from './pages/contact-us/contact-us-details/contact-us-details.component';
import { AboutUsTableComponent } from './pages/about-us/about-us-table/about-us-table.component';
import { AboutUsDetailsComponent } from './pages/about-us/about-us-details/about-us-details.component';
import { SpecialOrderTableComponent } from './pages/special-order/special-order-table/special-order-table.component';
import { SpecialOrderDetailsComponent } from './pages/special-order/special-order-details/special-order-details.component';
import { RoleTableComponent } from './pages/roles/role-table/role-table.component';
import { RoleDetailsComponent } from './pages/roles/role-details/role-details.component';
import { DistrictTableComponent } from './pages/district/district-table/district-table.component';
import { DistrictDetailsComponent } from './pages/district/district-details/district-details.component';
import { AdminTableComponent } from './pages/admin/admin-table/admin-table.component';
import { AdminDetailsComponent } from './pages/admin/admin-details/admin-details.component';
import { EditProfileComponent } from './pages/profile/edit-profile/edit-profile.component';
import { AddNotificationsComponent } from './pages/add-notifications/add-notifications.component';
import { CategoryTableComponent } from './pages/category/category-table/category-table.component';
import { CategoryDetailsComponent } from './pages/category/category-details/category-details.component';
import { MainCatogoryTableComponent } from './pages/main-category/main-catogory-table/main-catogory-table.component';
import { MainCatogoryDetailsComponent } from './pages/main-category/main-catogory-details/main-catogory-details.component';
import { SubCategoryTableComponent } from './pages/sub-category/sub-category-table/sub-category-table.component';
import { SubCategoryDetailsComponent } from './pages/sub-category/sub-category-details/sub-category-details.component';
import { ProductsTableComponent } from './pages/products/products-table/products-table.component';
import { ProductsDetailsComponent } from './pages/products/products-details/products-details.component';
import { TraderTableComponent } from './pages/traders/trader-table/trader-table.component';
import { TraderDetailsComponent } from './pages/traders/trader-details/trader-details.component';
import { TraderRequestsTableComponent } from './pages/traders/trader-requests-table/trader-requests-table.component';
import { TraderRequestsDetailsComponent } from './pages/traders/trader-requests-details/trader-requests-details.component';
import { PieceProductsTableComponent } from './pages/piece-products/piece-products-table/piece-products-table.component';
import { PieceProductsDetailsComponent } from './pages/piece-products/piece-products-details/piece-products-details.component';
import { ArticleTableComponent } from './pages/article/article-table/article-table.component';
import { ArticleDetailsComponent } from './pages/article/article-details/article-details.component';
import { TargetComponent } from './pages/target/target.component';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'forget_password', component: ForgetPasswordComponent },
      { path: 'reset_password', component: ResetPasswordComponent },
    ]
  },
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [authGuard], // Applying authGuard to the home layout
    children: [
      { path: 'dashboard-trader', component: DashboardComponent },
      { path: 'dashboard-admin', component: DashboardAdminComponent },
      { path: 'working_hours', component: WorkingHoursTableComponent },
      { path: 'working_hours/add', component: WorkingHoursDetailsComponent },
      { path: 'working_hours/edit/:id', component: WorkingHoursDetailsComponent },
      { path: 'working_hours/view/:id', component: WorkingHoursDetailsComponent },
      { path: 'settings', component: SettingsComponent, canActivate: [authGuard],  // Apply authGuard to settings
        children: [
          { path: 'faqs', component: FaqsTableComponent },
          { path: 'faqs/add', component: FagsDetailsComponent },
          { path: 'faqs/edit/:id', component: FagsDetailsComponent },
          { path: 'faqs/view/:id', component: FagsDetailsComponent },

          { path: 'terms_conditions', component: TermsConditionsTableComponent },
          { path: 'terms_conditions/add', component: TermsConditionsDetailsComponent },
          { path: 'terms_conditions/edit/:id', component: TermsConditionsDetailsComponent },
          { path: 'terms_conditions/view/:id', component: TermsConditionsDetailsComponent },

          { path: 'privacy_policy', component: PrivacyPolicyTableComponent },
          { path: 'privacy_policy/add', component: PrivacyPolicyDetailsComponent },
          { path: 'privacy_policy/edit/:id', component: PrivacyPolicyDetailsComponent },
          { path: 'privacy_policy/view/:id', component: PrivacyPolicyDetailsComponent },

          {path:'social_media',component:SocialMediaUpdateComponent},

          { path: 'slider', component: SliderTableComponent },
          { path: 'slider/add', component: SliderDetailsComponent },
          { path: 'slider/edit/:id', component: SliderDetailsComponent },
          { path: 'slider/view/:id', component: SliderDetailsComponent },

          { path: 'roles', component: RoleTableComponent },
          { path: 'role/add', component: RoleDetailsComponent },
          { path: 'role/edit/:id', component: RoleDetailsComponent },
          { path: 'role/view/:id', component: RoleDetailsComponent },

          { path: 'district', component: DistrictTableComponent },
          { path: 'district/add', component: DistrictDetailsComponent },
          { path: 'district/edit/:id', component: DistrictDetailsComponent },
          { path: 'district/view/:id', component: DistrictDetailsComponent },

          { path: 'admin', component: AdminTableComponent },
          { path: 'admin/add', component: AdminDetailsComponent },
          { path: 'admin/edit/:id', component: AdminDetailsComponent },
          { path: 'admin/view/:id', component: AdminDetailsComponent },

          { path: 'add_notification', component: AddNotificationsComponent },
        ]
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/edit/:id', component: EditProfileComponent },

      { path: 'services', component: ServicesTableComponent },
      { path: 'service/add', component: ServicesDetailsComponent },
      { path: 'service/view/:id', component: ServicesDetailsComponent },
      { path: 'service/edit/:id', component: ServicesDetailsComponent },

      { path: 'country', component: CountriesTableComponent },
      { path: 'country/add', component: CountriesDetailsComponent },
      { path: 'country/view/:id', component: CountriesDetailsComponent },
      { path: 'country/edit/:id', component: CountriesDetailsComponent },

      
      { path: 'trader', component: TraderTableComponent },
      { path: 'trader/add', component: TraderDetailsComponent },
      { path: 'trader/view/:id', component: TraderDetailsComponent },
      { path: 'trader/edit/:id', component: TraderDetailsComponent },

      { path: 'trader-request', component: TraderRequestsTableComponent },
      { path: 'trader-request/add', component: TraderRequestsDetailsComponent },
      { path: 'trader-request/view/:id', component: TraderRequestsDetailsComponent },
      { path: 'trader-request/edit/:id', component: TraderRequestsDetailsComponent },

      { path: 'category', component: CategoryTableComponent },
      { path: 'category/add', component: CategoryDetailsComponent },
      { path: 'category/view/:id', component: CategoryDetailsComponent },
      { path: 'category/edit/:id', component: CategoryDetailsComponent },

      { path: 'sub-category', component: SubCategoryTableComponent },
      { path: 'sub-category/add', component: SubCategoryDetailsComponent },
      { path: 'sub-category/view/:id', component: SubCategoryDetailsComponent },
      { path: 'sub-category/edit/:id', component: SubCategoryDetailsComponent },

      { path: 'product', component: ProductsTableComponent },
      { path: 'product/add', component: ProductsDetailsComponent },
      { path: 'product/view/:id', component: ProductsDetailsComponent },
      { path: 'product/edit/:id', component: ProductsDetailsComponent },

      { path: 'piece-product', component: PieceProductsTableComponent },
      { path: 'piece-product/add', component: PieceProductsDetailsComponent },
      { path: 'piece-product/view/:id', component: PieceProductsDetailsComponent },
      { path: 'piece-product/edit/:id', component: PieceProductsDetailsComponent },

      { path: 'clients', component: ClientTableComponent },
      { path: 'client/add', component: ClientDetailsComponent },
      { path: 'client/view/:id', component: ClientDetailsComponent },
      { path: 'client/edit/:id', component: ClientDetailsComponent },

      { path: 'article', component: ArticleTableComponent },
      { path: 'article/add', component: ArticleDetailsComponent },
      { path: 'article/view/:id', component: ArticleDetailsComponent },
      { path: 'article/edit/:id', component: ArticleDetailsComponent },

      { path: 'slider', component: SliderTableComponent },
      { path: 'slider/add', component: SliderDetailsComponent },
      { path: 'slider/edit/:id', component: SliderDetailsComponent },
      { path: 'slider/view/:id', component: SliderDetailsComponent },

      { path: 'main_category', component: MainCatogoryTableComponent },
      { path: 'main_category/add', component: MainCatogoryDetailsComponent },
      { path: 'main_category/view/:id', component: MainCatogoryDetailsComponent },
      { path: 'main_category/edit/:id', component: MainCatogoryDetailsComponent },

      { path: 'city', component: CitiesTableComponent },
      { path: 'city/add', component: CityDetailsComponent },
      { path: 'city/view/:id', component: CityDetailsComponent },
      { path: 'city/edit/:id', component: CityDetailsComponent },

      { path: 'faqs', component: FaqsTableComponent },
      { path: 'faqs/add', component: FagsDetailsComponent },
      { path: 'faqs/edit/:id', component: FagsDetailsComponent },
      { path: 'faqs/view/:id', component: FagsDetailsComponent },

      { path: 'cancel-reason', component: CancelReasonTableComponent },
      { path: 'cancel-reason/add', component: CancelReasonDetailsComponent },
      { path: 'cancel-reason/view/:id', component: CancelReasonDetailsComponent },
      { path: 'cancel-reason/edit/:id', component: CancelReasonDetailsComponent },

      { path: 'target', component: TargetComponent },


      { path: 'complaint', component: ComplaintTableComponent },
      { path: 'complaint/add', component: ComplaintDetailsComponent },
      { path: 'complaint/view/:id', component: ComplaintDetailsComponent },
      { path: 'complaint/edit/:id', component: ComplaintDetailsComponent },

      { path: 'contract-type', component: ContractTypeTableComponent },
      { path: 'contract-type/add', component: ContractTypeDetailsComponent },
      { path: 'contract-type/view/:id', component: ContractTypeDetailsComponent },
      { path: 'contract-type/edit/:id', component: ContractTypeDetailsComponent },

      { path: 'copone', component: CoponeTableComponent },
      { path: 'copone/add', component: CoponeDetailsComponent },
      { path: 'copone/view/:id', component: CoponeDetailsComponent },
      { path: 'copone/edit/:id', component: CoponeDetailsComponent },

      { path: 'paymentWay', component: PaymentWayTableComponent },
      { path: 'paymentWay/add', component: PaymentWayDetailsComponent },
      { path: 'paymentWay/view/:id', component: PaymentWayDetailsComponent },
      { path: 'paymentWay/edit/:id', component: PaymentWayDetailsComponent },

      { path: 'package', component: PackageTableComponent },
      { path: 'package/add', component: PackageDetailsComponent },
      { path: 'package/view/:id', component: PackageDetailsComponent },
      { path: 'package/edit/:id', component: PackageDetailsComponent },

      { path: 'technical-specialist', component: TechnicalSpecialistTableComponent },
      { path: 'technical-specialist/add', component: TechnicalSpecialistDetailsComponent },
      { path: 'technical-specialist/view/:id', component: TechnicalSpecialistDetailsComponent },
      { path: 'technical-specialist/edit/:id', component: TechnicalSpecialistDetailsComponent },

      { path: 'orders', component: OrdersTableComponent },
      { path: 'order/add', component: OrdersDetailsComponent },
      { path: 'order/view/:id', component: OrdersDetailsComponent },
      { path: 'order/edit/:id', component: OrdersDetailsComponent },

      { path: 'contact-us', component: ContactUsTableComponent },
      { path: 'contact-us/add', component: ContactUsDetailsComponent },
      { path: 'contact-us/view/:id', component: ContactUsDetailsComponent },
      { path: 'contact-us/edit/:id', component: ContactUsDetailsComponent },

      { path: 'about-us', component: AboutUsTableComponent },
      { path: 'about-us/add', component: AboutUsDetailsComponent },
      { path: 'about-us/view/:id', component: AboutUsDetailsComponent },
      { path: 'about-us/edit/:id', component: AboutUsDetailsComponent },

      { path: 'special-order', component: SpecialOrderTableComponent },
      { path: 'special-order/view/:id', component: SpecialOrderDetailsComponent },
      { path: 'special-order/edit/:id', component: SpecialOrderDetailsComponent },
    ]
  },
  { path: '**', component: NotFoundComponent }
];
