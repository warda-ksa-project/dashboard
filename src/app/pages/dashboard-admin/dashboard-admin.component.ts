import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { Roles } from '../../conts';
import { ChartComponent } from '../../components/chart/chart.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { CalendarModule } from 'primeng/calendar';

const global_pageName = 'products.pageName';
const global_router_add_url_in_Table = '/product/add';
const global_router_view_url = '/product/view';
const global_router_edit_url = '/product/edit';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    NgFor,
    RouterModule,
    ChartComponent,
    NgIf,
    TranslatePipe,
    ProgressBarModule,
    FormsModule,
    ChartComponent,
    CalendarModule,
    CurrencyPipe
  ],
  providers:[CurrencyPipe],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss',
})
export class DashboardAdminComponent {
  global_router_add_url_in_Table = global_router_add_url_in_Table;
  pageName = signal<string>(global_pageName);
  private ApiService = inject(ApiService);
  private currencyPipe = inject(CurrencyPipe);
  firstDateName = ''
  secondDateName = ''
  staticDetails: any;
  totalCount: number = 0;
  dateRange: any = [new Date(), new Date()]
  apiService = inject(ApiService);
  role: any = '';
  RolesEnum = Roles;
  // allMonthSales: any[] = [];
  allWeeksSales: any[]=[];
  allPastWeeks:any[]=[]
  // allTargetMonth: number[] = [];
  // allTargetWeek: number[] = [];

  bredCrumb: IBreadcrumb = {
    crumbs: [],
  };
  selectedLang: any;
  languageService = inject(LanguageService);
  objectSearch = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: '',
    sortingDirection: 0,
    enName: '',
    arName: '',
  };
  labels: any = [];

  dataCardItems: any;
  selectedPaginationValue = 10;
  cityData: any[] = []
  usersList: any
  items: any = [
    {
      titleAr: 'عدد الطلبات المكتملة',
      titleEn: 'Complete Orders Count',
      icon: 'pi pi-database',
      price: '0',
      status: '60%',
      type: 'order',
      typeAr: 'طلب ',
    },
    {
      titleAr: ' عدد الطلبات  الملغية',
      titleEn: ' Cancel Order Count',
      icon: 'pi pi-shop',
      price: '0',
      status: '60%',
      type: 'order',
      typeAr: 'طلب  ',
    },
    {
      titleAr: 'عدد المنتجات  ',
      titleEn: 'Product Count',
      icon: 'pi pi-shopping-cart',
      price: '0',
      status: '60%',
      type: 'product',
      typeAr: 'منتج',
    },
    {
      titleAr: 'عدد  الطلبات بالقطعة',
      titleEn: 'Product Piece Count',
      icon: 'pi pi-shopping-cart',
      price: '0',
      status: '60%',
      type: 'product',
      typeAr: ' منتج ',
    },
    {
      titleAr: 'عدد الفئات',
      titleEn: 'Category Count',
      icon: 'pi pi-inbox',
      price: '0',
      status: '60%',
      type: 'Category',
      typeAr: 'فئة',
    },
    {
      titleAr: 'عدد الطلبات',
      titleEn: 'Orders Count',
      icon: 'pi pi-inbox',
      price: '0',
      status: '60%',
      type: 'Order',
      typeAr: 'طلب',
    },
    {
      titleAr: 'عدد الفئات الفرعية',
      titleEn: 'subCategory Count',
      icon: 'pi pi-inbox',
      price: '0',
      status: '60%',
      type: 'subCategory',
      typeAr: 'فئة فرعية',
    },
    {
      titleAr: 'المبيعات',
      titleEn: 'All Sales',
      icon: 'pi pi-database',
      price: '0',
      status: '60%',
      type: 'SRA',
      typeAr: 'ريال سعودي',
    },
  ];
  ngOnInit(): void {
    this.pageName.set(global_pageName);
    this.getBreadCrumb();
    this.getRoles();

    this.selectedLang = this.languageService.translationService.currentLang;
    this.labels = [
      this.selectedLang == 'en' ? 'Sat' : 'السبت',
      this.selectedLang == 'en' ? 'Sun' : 'الاحد',
      this.selectedLang == 'en' ? 'Mon' : 'الاثنين',
      this.selectedLang == 'en' ? 'Tue' : 'الثلاثاء',
      this.selectedLang == 'en' ? 'Wed' : 'الاربعاء',
      this.selectedLang == 'en' ? 'Thu' : 'الخميس',
      this.selectedLang == 'en' ? 'Fri' : 'الجمعة',
      // this.selectedLang == 'en' ? 'August' : 'اغسطس',
      // this.selectedLang == 'en' ? 'September' : 'سبتمبر',
      // this.selectedLang == 'en' ? 'October' : 'اكتوبر',
      // this.selectedLang == 'en' ? 'November' : 'نوفمبر',
      // this.selectedLang == 'en' ? 'December' : 'ديسمبر',
    ];

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    });
  }

  // getAllSalesPerMonth() {
  //   this.ApiService.get('DashboardAdmin/GetAllSalesPerMonth').subscribe(
  //     (res: any) => {
  //       this.allMonthSales = Object.values(res).sort((a: any, b: any) => a - b);
  //       this.getAllTargetAPI();
  //     }
  //   );
  // }

  getAllSalesPerWeek() {
    this.ApiService.get('DashboardAdmin/GetAllSalesOrderPerWeek').subscribe(
      (res: any) => {
        // this.allWeeksSales = res
        this.firstDateName = `${this.languageService.translationService.instant('dashboard_admin.chart.firstDataName')}  ${this.currencyPipe.transform(res.salesForThisWeek, 'USD', '', '1.0-0')}`;
        this.secondDateName = `${this.languageService.translationService.instant('dashboard_admin.chart.secondDataName')} ${this.currencyPipe.transform(res.salesFromAWeekAgo, 'USD', '', '1.0-0')}`;
        this.allWeeksSales=[res.saturday,res.sunday,res.monday,res.tuesday,res.wednesday,res.thursday,res.friday],
        this.allPastWeeks=[res.lastSaturday,res.lastSunday,res.lastMonday,res.lastTuesday,res.lastWednesday,res.lastThursday,res.lastFriday]
      }
    );
  }


  getAllUsers(payload: any) {
    this.ApiService.post('DashboardAdmin/GetAllUserDashboardStatistics', payload).subscribe((res: any) => {
      this.usersList = res
    })
  }

  getAllRevenueForEveryCity() {
    this.ApiService.get('DashboardAdmin/GetAllRevenueForEveryCity').subscribe((res: any) => {
      this.cityData = res
    });
  }
  // getAllTargetAPI() {
  //   this.ApiService.get('target/GetAll').subscribe((res: any) => {
  //     console.log('DashboardComponent  this.ApiService.get  res:', res);
  //     this.allTargetMonth = this.getTarget(res.data);
  //     console.log(
  //       'DashboardComponent  this.ApiService.get      this.allTargetMonth:',
  //       this.allTargetMonth
  //     );
  //   });
  // }

  getTarget(data: any) {
    return data
      .sort((a: any, b: any) => a.month - b.month)
      .map((item: any) => item.target);
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(this.pageName()),
        },
      ],
    };
  }

  getStaticData() {
    this.ApiService.get(
      'DashboardAdmin/GetAllAdminDashboardStatistics'
    ).subscribe((res: any) => {
      this.dataCardItems = res;
      if (res) {
        this.items[0].price = res.completeOrdersCount;
        this.items[1].price = res.canceledOrdersCount;
        this.items[2].price = res.productCount;
        this.items[3].price = res.productPieceCount;
        this.items[4].price = res.categoryCount;
        this.items[5].price = res.ordersCount;
        this.items[6].price = res.subCategoryCount;
        this.items[7].price = res.allSales;

      }
    });
  }

  getAllSalesOrderDashboardStatistics() {
    this.ApiService.get(
      'DashboardTrader/GetAllSalesOrderDashboardStatistics'
    ).subscribe((res: any) => {
      this.staticDetails = res;
    });
  }

  onDateRange(date: any) {
    const formattedRange = {
      fromDate: this.formatDate(date[0]),
      toDate: this.formatDate(date[1])
    };
    console.log("DashboardAdminComponent  onDateRange  formattedRange:", formattedRange)

    if (date[1])
      this.getAllUsers(formattedRange)

  }
  formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  getRoles() {
    this.apiService.get('Auth/getRoles').subscribe((res: any) => {
      this.role = res.message;
      this.getStaticData();
      this.getAllRevenueForEveryCity();
      // this.getAllSalesPerMonth();
      this.getAllSalesPerWeek();
      const formattedRange = {
        fromDate: this.formatDate(this.dateRange[0]),
        toDate: this.formatDate(this.dateRange[1])
      };
      this.getAllUsers(formattedRange)
    });
  }
}
