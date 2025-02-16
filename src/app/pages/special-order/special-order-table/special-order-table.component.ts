import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import {  RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { NgIf, TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectComponent } from '../../../components/select/select.component';
import { special_order_enum, special_order_status } from '../../../conts';

const global_pageName = 'special_order.pageName'
const global_router_add_url_in_Table = '/special-order/add'
const global_router_view_url = 'special-order/view'
const global_router_edit_url = 'special-order/edit'
const global_API_getAll = 'specialOrder/GetAllWitPagination'
const global_API_delete = 'specialOrder/Delete?id'

@Component({
  selector: 'app-special-order-table',
  standalone: true,
  imports: [TableComponent,SelectComponent,NgIf, PaginationComponent, TitleCasePipe, TranslatePipe, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './special-order-table.component.html',
  styleUrl: './special-order-table.component.scss'
})
export class SpecialOrderTableComponent {

  global_router_add_url_in_Table = global_router_add_url_in_Table
  pageName = signal<string>(global_pageName);
  clientList:any[]=[]
  specialOrderEnumList=special_order_enum
  specialOrderStatusList=special_order_status
  showFilter: boolean = false
  tableActions: ITableAction[] = [
    // {
    //   name: EAction.delete,
    //   apiName_or_route: global_API_delete,
    //   autoCall: true
    // },
    // {
    //   name: EAction.view,
    //   apiName_or_route: global_router_view_url,
    //   autoCall: true
    // },
    {
      name: EAction.edit,
      apiName_or_route: global_router_edit_url,
      autoCall: true
    }
  ]
  private ApiService = inject(ApiService);



  bredCrumb: IBreadcrumb = {
    crumbs: [
    ]
  }

  statuses = [
    {
      id: 1,
      color: '#c1cd6a',
      nameAr: 'قيد الانتظار',
      nameEn: 'Pending'
    },
    {
      id: 2,
      color: '#3fac4e',
      nameAr: 'مكتمل',
      nameEn: 'Completed'
    },
    {
      id: 3,
      color: '#c32722',
      nameAr: 'ملغي',
      nameEn: 'Canceled'
    }
  ];

  objectSearch = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    specialOrderId:  null,//text
    //  amount: null,
    // media: null,
    clientId: null,//dr
    specialOrderEnum: null,
    specialOrderStatusEnum:null

  }

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = []
  columns: IcolHeader[] = [];
  columnsSmallTable: IcolHeaderSmallTable[] = []

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set(global_pageName)
    this.API_getAll();
    this.getAllClients();
    this.getBreadCrumb();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.getAllClients();
      this.getBreadCrumb();
    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'specialOrderId', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'amount', header: this.languageService.translate('special_order.form.amount'), type: EType.text, show: true },
      { keyName: 'clientId', header: this.languageService.translate('special_order.form.clientId'), type: EType.text, show: true },
      { keyName: 'creationTime', header: this.languageService.translate('order.form.date'), type: EType.date, show: true },
      // { keyName: currentLang === 'ar'  ? 'serviceNameAr' : 'serviceNameEn', header: this.languageService.translate('SERVICE_NAME'), type: EType.text, show: true },
      // { keyName: 'nextVistDate', header: this.languageService.translate('nextVisit'), type: EType.date, show: true },
      // { keyName: 'visitNumber', header: this.languageService.translate('visitNumber'), type: EType.text, show: true },
      { keyName: 'specialOrderName', header: this.languageService.translate('special_order.form.specialOrderEnum'), type: EType.text, show: true },
      { keyName: currentLang === 'ar' ? 'orderStatusAr' : 'orderStatusEn', header: this.languageService.translate('order.form.order_status'), type: EType.specialOrderStatus, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable = [
      { keyName: 'specialOrderId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'amount', header: this.languageService.translate('special_order.form.amount'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'clientId', header: this.languageService.translate('special_order.form.clientId'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'specialOrderStatusName', header: this.languageService.translate('special_order.form.specialOrderStatusEnum'), type: EType.specialOrderStatus, showAs: ETableShow.content },
    ];
  }


  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label:  this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(this.pageName()),
        },
      ]
    }
  }

  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

  API_getAll() {
    this.ApiService.post(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data.dataList;

        this.totalCount = res.data.totalCount;
        this.dataList.forEach((data: any) => {
          // Find the matching status object using the orderStatusEnum property
          const statusObj = this.statuses.find((status: any) => status.id === data.specialOrderStatus);
          if (statusObj) {
            // Create two new properties with Arabic and English values
            data.orderStatusAr = statusObj.nameAr;
            data.orderStatusEn = statusObj.nameEn;
          }
        });
        console.log(this.dataList);

        this.filteredData = [...this.dataList];
      }

    })
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

  onSelectedValue(selectedItem:any,value:string){
    if(value=='specialOrderStatusEnum')
      this.objectSearch.specialOrderStatusEnum=selectedItem
    else   if(value=='specialOrderEnum')
      this.objectSearch.specialOrderEnum=selectedItem
    else
    this.objectSearch.clientId=selectedItem

}

getAllClients(){
  this.ApiService.get('Client/GetAllActive').subscribe((res:any)=>{
   this.clientList=[]
   if(res.data)
     res.data.map((item:any)=>{
   this.clientList.push({
     name:item.firstName,
     code:item.userId
   })
   })
  })
 }
  onSubmitFilter() {
    let specialOrderId:any =Number(this.objectSearch.specialOrderId)
    this.objectSearch.specialOrderId=specialOrderId

    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      pageNumber: 0,
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      specialOrderId: null,
      // amount: '',
      // media: "",
      clientId: null,
      specialOrderEnum: null,
      specialOrderStatusEnum:null
    }
    this.API_getAll();
    this.showFilter = false
  }


}

