import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { EAction, EType, IcolHeader, ITableAction, IToggleOptions, TableComponent } from '../../../components/table/table.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { ApiService } from '../../../services/api.service';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

const global_pageName='payment.pageName'
const global_API_Name='paymentWay'
const global_router_add_url_in_Table ='/'+global_API_Name+'/add'
const global_router_view_url =global_API_Name+'/view'
const global_router_edit_url =global_API_Name+'/edit'
const global_API_getAll =global_API_Name+'/GetAllWithPagination'
const global_API_delete=global_API_Name+'/changeStatus?id'
const global_toggleOptions:IToggleOptions={
  apiName:'paymentWay/Update',
  autoCall:true,
  }
@Component({
  selector: 'app-payment-way-table',
  standalone: true,
  imports: [
    TableComponent,
    TitleCasePipe,
    PaginationComponent,
    FormsModule,
    DrawerComponent,
    BreadcrumpComponent,
     RouterModule,
     InputTextModule,
     TableSmallScreenComponent,
     TranslatePipe
    ],
  templateUrl: './payment-way-table.component.html',
  styleUrl: './payment-way-table.component.scss'
})
export class PaymentWayTableComponent {
  global_router_add_url_in_Table =global_router_add_url_in_Table
  pageName =signal<string>(global_pageName);

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: global_API_delete,
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route:  global_router_view_url,
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: global_router_edit_url,
      autoCall: true
    }
  ]
  private ApiService = inject(ApiService)


  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  objectSearch = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    enName: "",
    arName: ""
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
    this.getBreadCrumb();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.getBreadCrumb();
    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'enName', header: this.languageService.translate('payment.form.name_en'), type: EType.text, show: true },
      { keyName: 'arName', header: this.languageService.translate('payment.form.name_ar'), type: EType.text, show: true },
      { keyName: 'isEnabled', header: this.languageService.translate('payment.form.isEnabled'), type: EType.toggle,toggleOptions:global_toggleOptions, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName:  'enName', header: this.languageService.translate('payment.form.name_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'arName' , header: this.languageService.translate('payment.form.name_ar'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'isEnabled', header: this.languageService.translate('payment.form.isEnabled'), type: EType.toggle,toggleOptions:global_toggleOptions, show: true },
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
        ];
  }

  openFilter() {
    this.showFilter = true
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
  onCloseFilter(event: any) {
    this.showFilter = false
  }

  API_getAll() {
    this.ApiService.post(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data.dataList;
        this.totalCount = res.data.totalCount;
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

  onSubmitFilter() {
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      pageNumber: 0,
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      enName: "",
      arName: ""
    }
    this.API_getAll();
    this.showFilter = false
  }

}

