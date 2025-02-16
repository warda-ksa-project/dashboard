import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { NgFor, TitleCasePipe } from '@angular/common';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { ApiService } from '../../../services/api.service';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

const global_pageName='tech.pageName';
const global_API_Name='Technical';
const global_router_add_url_in_Table ='/technical/add';
const global_router_view_url ='/technical/view';
const global_router_edit_url ='/technical/edit';
const global_API_getAll =global_API_Name+'/GetAllWithPagination';
const global_API_Active=global_API_Name+'/Activate?userId';
const global_API_block=global_API_Name+'/Delete?userId';

@Component({
  selector: 'app-technical-table',
  standalone: true,
  imports: [
    TableComponent,
    TitleCasePipe,
    TranslatePipe,
    PaginationComponent,
    FormsModule,
    DrawerComponent,
    BreadcrumpComponent,
     RouterModule,
     InputTextModule,
     TableSmallScreenComponent,
     NgFor
  ],
  templateUrl: './technical-table.component.html',
  styleUrl: './technical-table.component.scss'
})
export class TechnicalTableComponent {

  global_router_add_url_in_Table =global_router_add_url_in_Table
  pageName =signal<string>(global_pageName);

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'Technical/Delete?userId',
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
    },
    {
      name: EAction.active,
      apiName_or_route: global_API_Active,
      autoCall: true
    },
    {
      name: EAction.block,
      apiName_or_route: global_API_block,
      autoCall: true
    }
  ]
  private ApiService = inject(ApiService)


  bredCrumb: IBreadcrumb = {
    crumbs: [

    ]
  }

  objectSearch = {
    "pageNumber": 0,
    "pageSize": 8,
    "sortingExpression": "",
    "sortingDirection": 0,
    "isActive": null,
    "fullName": "",
    "userName": "",
    "email": ""
  }

  clientStatuslist = [
    { id: null, name: 'shared.all' },
    { id: true, name: 'shared.ctive' },
    { id: false, name: 'shared.deactive' },
  ];

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
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang);
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang);
      this.getBreadCrumb();
    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'userId', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'fullName', header: this.languageService.translate('client.form.name'), type: EType.text, show: true },
      { keyName: 'username', header: this.languageService.translate('client.form.userName'), type: EType.text, show: true },
      { keyName: 'mobileNumber', header: this.languageService.translate('client.form.mobile'), type: EType.text, show: true },
      { keyName: 'creationTime', header: this.languageService.translate('order.form.date'), type: EType.date, show: true },
      { keyName: currentLang === 'ar' ? 'technicalEmployeeNameAr' : 'technicalEmployeeNameEn', header: this.languageService.translate('client.form.emName'), type: EType.text, show: true },
      { keyName: currentLang === 'ar'  ? 'technicalSpecializeNameAr' : 'technicalSpecializeNameEn', header: this.languageService.translate('client.form.emSpetialization'), type: EType.text, show: true },
      { keyName: 'email', header: this.languageService.translate('tech.form.email'), type: EType.text, show: true },
      { keyName: 'isActive', header: this.languageService.translate('tech.form.isActive'), type: EType.boolean, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable = [
      { keyName: 'fullName', header: this.languageService.translate('client.form.name'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'mobileNumber', header: this.languageService.translate('client.form.mobile'), type: EType.text, showAs: ETableShow.header },      { keyName: 'userId', header: this.languageService.translate('tech.form.userName'), type: EType.id, show: false },
      { keyName: currentLang === 'ar' ? 'arDescription' : 'enDescription', header: this.languageService.translate('tech.form.fullName'), type: EType.editor, showAs: ETableShow.content }
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
      "pageNumber": 0,
    "pageSize": 8,
    "sortingExpression": "",
    "sortingDirection": 0,
    "isActive": null,
    "fullName": "",
    "userName": "",
    "email": ""
    }
    this.API_getAll();
    this.showFilter = false
  }

  reloadGetAllApi(e: any) {
    if(e) {
      this.API_getAll();
    }
  }

}


