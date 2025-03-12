import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Knob } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../components/table/table.component';
import { DrawerComponent } from '../../components/drawer/drawer.component';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { LanguageService } from '../../services/language.service';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import { Roles } from '../../conts';
import { ChartComponent } from "../../components/chart/chart.component";

const global_pageName = 'products.pageName';
const global_router_add_url_in_Table = '/product/add';
const global_router_view_url = '/product/view';
const global_router_edit_url = '/product/edit';
const global_API_getAll = 'product' + '/GetAllWithPagination';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, RouterModule, PaginationComponent,ChartComponent, NgIf, TableSmallScreenComponent, TranslatePipe, TableComponent, DrawerComponent, Knob, FormsModule, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
 global_router_add_url_in_Table = global_router_add_url_in_Table;
  pageName = signal<string>(global_pageName);
  private ApiService = inject(ApiService);

  staticDetails: any;
  totalCount: number = 0;
  filteredData: any;
    dataList: any = [];
    columns: IcolHeader[] = [];
    showFilter: boolean = false;
    searchValue: any = '';
    apiService=inject(ApiService)
    role:any=''
    RolesEnum=Roles
    allMonthSales:any[]=[]
    allTargetMonth:number[]=[]
    columnsSmallTable: IcolHeaderSmallTable[] = [];
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
    labels:any=[]

    tableActions: ITableAction[] = [
      {
        name: EAction.delete,
        apiName_or_route: 'product/Delete?id',
        autoCall: true,
      },
      {
        name: EAction.view,
        apiName_or_route: global_router_view_url,
        autoCall: true,
      },
      {
        name: EAction.edit,
        apiName_or_route: global_router_edit_url,
        autoCall: true,
      },
    ];
//     completeOrdersCount
// : 
// 2
// pendingOrdersCount
// : 
// 0
// productCount
// : 
// 0
// productPieceCount
// : 
// 1

  items:any=[
    {
      titleAr:'عدد الطلبات المكتملة',
      titleEn:'Complete Orders Count',
      icon:'pi pi-database',
      price:'0',
      status:'60%',
      type:'order',
       typeAr:'طلب '
    },
    {
      titleAr:' عدد الطلبات تحت الاجراء',
      titleEn:'Pending Order Count',
      icon:'pi pi-shop',
      price:'0',
      status:'60%',
      type:'order',
      typeAr:'طلب  '
    
    },
    {
      titleAr:'عدد المنتجات  ',
      titleEn:'Product Count',
      icon:'pi pi-shopping-cart',
      price:'0',
      status:'60%',
      type:'product',
      typeAr:'منتج'

    },
    {
      titleAr:'عدد  الطلبات بالقطعة',
      titleEn:'Product Piece Count',
      icon:'pi pi-shopping-cart',
      price:'0',
      status:'60%',
      type:'product',
      typeAr:' منتج '

    }
    // , {
    //   titleAr:'الطلبات المكتملة',
    //   titleEn:'Total',
    //   icon:'pi pi-inbox',
    //   price:'230',
    //   status:'60%',
    //   type:'Complete Order'
    // }
  ]
  ngOnInit(): void {
    this.pageName.set(global_pageName);
    this.API_getAll();
    this.getBreadCrumb();
    this.getStaticData();
    this.getRoles();
    this.getAllSalesOrderDashboardStatistics();
    this.getAllSalesPerMonth()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.labels=[
      this.selectedLang=='en'?'January':'يناير',
      this.selectedLang=='en'? 'February':'فبراير', 
      this.selectedLang=='en'? 'March':'مارس', 
       this.selectedLang=='en'?'April':'ابريل', 
       this.selectedLang=='en'?'May':'مايو', 
       this.selectedLang=='en'?'June':'يونيو', 
       this.selectedLang=='en'?'July':'يوليو',
       this.selectedLang=='en'?'August':'اغسطس',
       this.selectedLang=='en'?'September':'سبتمبر',
       this.selectedLang=='en'?'October':'اكتوبر',
       this.selectedLang=='en'?'November':'نوفمبر',
       this.selectedLang=='en'?'December':'ديسمبر']

    this.displayTableCols(this.selectedLang);
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      // this.displayTableCols(this.selectedLang);
      // this.getBreadCrumb();
      // this.getStaticData();
      // this.getRoles();
      // this.getAllSalesOrderDashboardStatistics()
      // this.getAllSalesPerMonth()

    });
    // this.getDashboardDetails();
  }

  getAllSalesPerMonth(){
  
  this.ApiService.get('DashboardTrader/GetAllSalesPerMonth').subscribe((res: any) => {
    //  this.allMonthSales=Object.values(res).sort((a:any, b:any) => a - b);
    this.allMonthSales=Object.values(res).sort((a:any, b:any) => a - b);
    this.allTargetMonth=[5,10,15,20,30,40,50,60,70,80,90,100]
  })
}
  // items: any[] = [
  //   { name: 'dashboard.client', value: 0, img: 'assets/images/dashboard/client.png', route: '/clients', id: 'clientCount' },
  //   { name: 'dashboard.technical', value: 0, img: 'assets/images/dashboard/technical-support.png', route: '/technicals', id: 'technicalCount' },
  //   { name: 'dashboard.order', value: 0, img: 'assets/images/dashboard/checklist.png', route: '/orders', id: 'orderCount' },
  //   { name: 'dashboard.contractType', value: 0, img: 'assets/images/dashboard/contract.png', route: '/contract-type', id: 'contractTypeCount' },
  //   { name: 'dashboard.package', value: 0, img: 'assets/images/dashboard/package.png', route: '/package', id: 'packageCount' },
  //   { name: 'dashboard.paymentWay', value: 0, img: 'assets/images/dashboard/payment-method.png', route: '/paymentWay', id: 'paymentWayCount' },
  //   { name: 'dashboard.service', value: 0, img: 'assets/images/dashboard/customer-service.png', route: '/services', id: 'serviceCount' },
  //   { name: 'dashboard.workingTime', value: 0, img: 'assets/images/dashboard/timetable.png', route: '/working_hours', id: 'workingTimeCount' },
  //   { name: 'dashboard.termsAndConditions', value: 0, img: 'assets/images/dashboard/terms-and-conditions.png', route: '/settings/terms_conditions', id: 'termsAndConditionsCount' },
  //   { name: 'dashboard.technicalSpecialist', value: 0, img: 'assets/images/dashboard/public-relations.png', route: '/technical-specialist', id: 'technicalSpecialistCount' },
  //   // { name: 'dashboard.orderAdditionalItems', value: 0, img: 'assets/images/dashboard/checklist.png', route: '/dashboard', id: 'orderAdditionalItemsCount' },
  //   { name: 'dashboard.FAQs', value: 0, img: 'assets/images/dashboard/faq.png', route: '/settings/faqs', id: 'faQsCount' },
  //   { name: 'dashboard.country', value: 0, img: 'assets/images/dashboard/coronavirus.png', route: '/country', id: 'countryCount' },
  //   { name: 'dashboard.coupon', value: 0, img: 'assets/images/dashboard/coupons.png', route: '/copone', id: 'coponeCount' },
  //   { name: 'dashboard.complaint', value: 0, img: 'assets/images/dashboard/bad.png', route: '/complaint', id: 'complaintCount' },
  //   { name: 'dashboard.city', value: 0, img: 'assets/images/dashboard/cityscape.png', route: '/city', id: 'cityCount' },
  //   { name: 'dashboard.admin', value: 0, img: 'assets/images/dashboard/no-data.png', route: '/settings/admin', id: 'adminCount' },
  //   { name: 'dashboard.driver', value: 0, img: 'assets/images/dashboard/package.png', route: '/technicals', id: 'driverCount' },
  //   { name: 'dashboard.specialOrder', value: 0, img: 'assets/images/dashboard/coronavirus.png', route: '/special-order', id: 'specialOrderCount' },

  // ];

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


  // getDashboardDetails() {
  //   this.ApiService.get('Dashborad/GetAll').subscribe((res: any) => {
  //     this.updateItemsWithData(res.data);
  //   })
  // }

  getStaticData() {
    this.ApiService.get('DashboardTrader/GetAllTraderDashboardStatistics').subscribe((res: any) => {
      // this.staticDetails = res
      this.items[0].price=res.completeOrdersCount
      this.items[1].price=res.pendingOrdersCount
      this.items[2].price=res.productCount
      this.items[3].price=res.productPieceCount

    })
  }

  getAllSalesOrderDashboardStatistics(){
    
    this.ApiService.get('DashboardTrader/GetAllSalesOrderDashboardStatistics').subscribe((res: any) => {
       this.staticDetails = res
      // this.items[0].price=res.completeOrdersCount
      // this.items[1].price=res.pendingOrdersCount
      // this.items[2].price=res.productCount
      // this.items[3].price=res.productPieceCount

    })
  }

  updateItemsWithData(data: any) {
    this.items.forEach((item: any) => {
      if (data.hasOwnProperty(item.id)) {
        item.value = data[item.id];
      }
    });
  }


 displayTableCols(currentLang: string) {
    this.columns = [
      {
        keyName: 'id',
        header: this.languageService.translate('Id'),
        type: EType.id,
        show: true,
      },
      {
        keyName: 'enName',
        header: this.languageService.translate('sub_category.form.enName'),
        type: EType.text,
        show: true,
      },
      {
        keyName: 'arName',
        header: this.languageService.translate('sub_category.form.arName'),
        type: EType.text,
        show: true,
      },
      {
        keyName: '',
        header: this.languageService.translate('Action'),
        type: EType.actions,
        actions: this.tableActions,
        show: true,
      },
    ];
    this.columnsSmallTable = [
      {
        keyName: 'id',
        header: this.languageService.translate('Id'),
        type: EType.id,
        show: false,
      },
      {
        keyName: 'enName',
        header: this.languageService.translate('sub_category.form.enName'),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'arName',
        header: this.languageService.translate('sub_category.form.arName'),
        type: EType.text,
        showAs: ETableShow.header,
      },
    ];
  }

  
  openFilter() {
    this.showFilter = true;
  }

  onCloseFilter(event: any) {
    this.showFilter = false;
  }

  API_getAll() {
      this.ApiService.post(global_API_getAll, this.objectSearch).subscribe(
        (res: any) => {
          if (res) {
            this.dataList = res.data.dataList;
            this.totalCount = res.data.totalCount;
            this.filteredData = [...this.dataList];
          }
        }
      );
    }
  
    getRoles(){
      this.apiService.get('Auth/getRoles').subscribe((res:any)=>{
      this.role=res.message
      })
    }
    onPageChange(event: any) {
      this.objectSearch.pageNumber = event;
      this.API_getAll();
    }
  
    filterData() {
      this.dataList = this.filteredData;
      const search = this.searchValue.toLowerCase();
  
      if (this.searchValue.length == 1) {
        this.dataList = this.filteredData;
        return;
      }
  
      this.dataList = this.dataList.filter(
        (item: any) =>
          item.enTitle.toLowerCase().includes(search) ||
          item.arTitle.toLowerCase().includes(search) ||
          item.enDescription.toLowerCase().includes(search) ||
          item.arDescription.toLowerCase().includes(search)
      );
    }
  
    onSubmitFilter() {
      this.API_getAll();
    }
  
    reset() {
      this.objectSearch = {
        pageNumber: 0,
        pageSize: 8,
        sortingExpression: '',
        sortingDirection: 0,
        enName: '',
        arName: '',
      };
      this.API_getAll();
      this.showFilter = false;
    }
}
