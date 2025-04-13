import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TitleCasePipe, NgIf } from '@angular/common';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { order_status, Roles } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';

const global_pageName = 'order.pageName'
const global_router_edit_url = '/order/edit'
const global_router_view_url = '/order/view'
const global_API_getAll = 'order/GetAll'

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [TableComponent, NgIf, SelectComponent,DialogModule, TitleCasePipe, TranslatePipe, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent, DatePicker],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent {

  pageName = signal<string>(global_pageName);
  router=inject(Router)
  // orderStatus = order_status
  orderStatusList:any=[]
  clientList: any[] = []
  packageList: any[] = []
  showFilter: boolean = false
  openEditDialog:boolean=false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'Order/Delete?id',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: global_router_edit_url,
      autoCall: false
    },
    {
      name: EAction.view,
      apiName_or_route:  global_router_view_url,
      autoCall: true
    },
  ]
  private ApiService = inject(ApiService)
 form = new FormGroup({
  orderId: new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    orderStatusId: new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
  })


  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  // statuses = [
  //   {
  //     id: 0,
  //     color: '#c1cd6a',
  //     nameAr: 'قيد الانتظار',
  //     nameEn: 'Pending'
  //   },
  //   {
  //     id: 1,
  //     color: '#c1cd6a',
  //     nameAr: 'مدفوع',
  //     nameEn: 'Paid'
  //   },
  //   {
  //     id: 2,
  //     color: '#b16acd',
  //     nameAr: 'مخصص للمزود',
  //     nameEn: 'AssignedToProvider'
  //   },
  //   {
  //     id: 3,
  //     color: '#ccc053',
  //     nameAr: 'في الطريق',
  //     nameEn: 'InTheWay'
  //   },
  //   {
  //     id: 4,
  //     color: '#9b9d9c',
  //     nameAr: 'محاولة حل المشكلة',
  //     nameEn: 'TryingSolveProblem'
  //   },
  //   {
  //     id: 5,
  //     color: '#49e97c',
  //     nameAr: 'محلول',
  //     nameEn: 'Solved'
  //   },
  //   {
  //     id: 6,
  //     color: '#49e97c',
  //     nameAr: 'تأكيد العميل',
  //     nameEn: 'ClientConfirmation'
  //   },
  //   {
  //     id: 7,
  //     color: '#49e97c',
  //     nameAr: 'مكتمل',
  //     nameEn: 'Completed'
  //   },
  //   {
  //     id: 8,
  //     color: '#e94949',
  //     nameAr: 'ملغي',
  //     nameEn: 'Canceled'
  //   }
  // ];


  objectSearch = {
    "pageNumber": 0,
    "pageSize": 8,
    "sortingExpression": "",
    "sortingDirection": 0,
    // "technicalId": null,
    // "clientId": null,
    // // "paymentWayId": null,
    // "orderStatus": null,
    // "nextVistTime": null,
    // "packageId": null,
    // // "coponeId": null,
    // // "orderSubTotal": null,
    // // "orderTotal": null,
    // // "locationId": null
  }

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = []
  columns: IcolHeader[] = [];
  maxDate = new Date();
  role=''

  columnsSmallTable: IcolHeaderSmallTable[] = []

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set(global_pageName)
    this.API_getAll();
    // this.getAllClients()
    // this.getAllPackages()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang);
    this.getBreadCrumb();
    this.API_getStatus()
    this.getRoles();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.API_getStatus()
      this.getRoles();
      // this.getAllClients();
      // this.getAllPackages();
      this.getBreadCrumb();
    })
  }
  getRoles(){
    this.ApiService.get('Auth/getRoles').subscribe((res:any)=>{
      this.role=res.data
    })
  }
  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
          routerLink:  this.role==Roles.admin?'/dashboard-admin':'/dashboard-trader',
        },
        {
          label: this.languageService.translate(this.pageName()),
        },
      ]
    }
  }


  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'customerName', header: this.languageService.translate('order.form.clientName'), type: EType.text, show: true },
      { keyName: 'traderName', header: this.languageService.translate('order.form.traderName'), type: EType.text, show: true },
      { keyName: 'paymentWay', header: this.languageService.translate('order.form.paymentWay'), type: EType.text, show: true },
      { keyName: 'totalPrice', header: this.languageService.translate('order.form.price'), type: EType.text, show: true },
      { keyName: 'addedDate', header: this.languageService.translate('order.form.date'), type: EType.date, show: true },
      { keyName: currentLang === 'ar' ? 'statusAr' : 'statusEn', header: this.languageService.translate('order.form.status'), type: EType.status,statusId:'statusEn', show: true },
      // { keyName: 'showOrderStatusButton', header: this.languageService.translate('Status_Action'), type: EType.changeOrderStatus, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'customerName', header: this.languageService.translate('order.form.clientName'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'totalPrice', header: this.languageService.translate('order.form.price'), type: EType.text, showAs: ETableShow.content }
    ];
  }


  // getAllClients() {
  //   this.ApiService.get('Client/GetAllActive').subscribe((res: any) => {
  //     this.clientList = []
  //     if (res.data)
  //       res.data.map((item: any) => {
  //         this.clientList.push({
  //           name: item.firstName,
  //           code: item.userId
  //         })
  //       })
  //   })
  // }

  // getAllPackages() {
  //   this.ApiService.get('Package/GetAllPackage').subscribe((res: any) => {
  //     this.packageList = []
  //     if (res.data)
  //       res.data.map((item: any) => {
  //         this.packageList.push({
  //           name: this.selectedLang == 'en' ? item.nameEn : item.nameAr,
  //           code: item.packageId
  //         })
  //       })
  //   })
  // }

  API_getStatus(){
    this.ApiService.get('orderStatus/getAllStatus').subscribe((res:any)=>{
      if(res.data){
        this.orderStatusList=[]
        res.data.map((item:any)=>{
          this.orderStatusList.push({
            name:this.selectedLang=='en'?item.titleEn:item.titleAr,
            code:item.id
          })

        })
      }
    })
  }

  onSelectedValue(selectedItem: any, value: string) {
    // if (value == 'package') {
    //   this.objectSearch.packageId = selectedItem;
    // }
    // else if (value == 'status') {
    //   this.objectSearch.orderStatus = selectedItem;
    // }
    // else if (value == 'clinet') {
    //   this.objectSearch.clientId = selectedItem
    // } else {
    //   this.objectSearch.nextVistTime = selectedItem
    // }
  }

  openFilter() {
    this.showFilter = true
    // this.objectSearch.clientId = null
    // this.objectSearch.orderStatus = null
    // this.objectSearch.packageId = null
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }


  API_getAll() {
    this.ApiService.post(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data.dataList;
        this.totalCount = res.data.totalCount;

        // Iterate over each data item
        // this.dataList.forEach((data: any) => {
        //   // For example, copying visitNumber from nested package object
        //   // data.visitNumber = data.package.visitNumber;

        //   // Find the matching status object using the orderStatusEnum property
        //   const statusObj = this.statuses.find((status: any) => status.id === data.orderStatusEnum);
        //   if (statusObj) {
        //     // Create two new properties with Arabic and English values
        //     data.orderStatusAr = statusObj.nameAr;
        //     data.orderStatusEn = statusObj.nameEn;
        //   }

        // if(data.paymentWayId == 1 && data.orderStatusEnum == 0) {
        //     data.showOrderStatusButton = true
        // } else {
        //   data.showOrderStatusButton = false
        // }
        // });

        this.filteredData = [...this.dataList];
        console.log(this.dataList);
      }
    });
  }


  onPageChange(event: any) {
    console.log(event);
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

    this.dataList = this.dataList.filter((item: any) =>
      item.enTitle.toLowerCase().includes(search) ||
      item.arTitle.toLowerCase().includes(search) ||
      item.enDescription.toLowerCase().includes(search) ||
      item.arDescription.toLowerCase().includes(search)
    );
  }

  onSubmit() {
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      "pageNumber": 0,
      "pageSize": 8,
      "sortingExpression": "",
      "sortingDirection": 0,
      // // "technicalId": null,
      // "clientId": null,
      // nextVistTime: null,
      // // "paymentWayId": null,
      // "orderStatus": null,
      // "packageId": null,
      // // "coponeId": null,
      // // "orderSubTotal": null,
      // // "orderTotal": null,
      // // "locationId": null
    }
    this.API_getAll();
    this.showFilter = false
  }

  onEditOrder(e:any){
  console.log("OrdersTableComponent  onEditOrder  e:", e)
  if(e.action.name=='edit'){
    this.openEditDialog=true;
    this.form.patchValue({
      orderId:e.record?.id,
      orderStatusId:e.record.statusId,
    })
  }
  console.log("OrdersTableComponent  onEditOrder  e:", this.form.value)


  }
  API_Edit(){
    this.ApiService.put('order/Update',this.form.value).subscribe(res=>{
      if(res){
       this.API_getAll()
        this.openEditDialog=false
      }

    })
  }
  reloadGetAllApi(e: any) {
    if (e) {
      this.API_getAll();
    }
  }

}
































