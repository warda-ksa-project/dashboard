import { TitleCasePipe, NgFor } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';



const global_pageName = 'category.pageName';
const global_API_Name = 'MainCategory';
const global_router_add_url_in_Table = '/main_category/add';
const global_router_view_url = '/main_category/view';
const global_router_edit_url = '/main_category/edit';
const global_API_getAll = global_API_Name + '/GetAllWithPagination';
const global_API_block = global_API_Name + '/Delete?Id';

@Component({
  selector: 'app-main-catogory-table',
  standalone: true,
  imports: [TableComponent,
    TitleCasePipe,
    TranslatePipe,
    PaginationComponent,
    FormsModule,
    DrawerComponent,
    BreadcrumpComponent,
    RouterModule,
    InputTextModule,
    TableSmallScreenComponent,
    NgFor,],
  templateUrl: './main-catogory-table.component.html',
  styleUrl: './main-catogory-table.component.scss'
})
export class MainCatogoryTableComponent {

  global_router_add_url_in_Table = global_router_add_url_in_Table
  pageName = signal<string>(global_pageName);

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'category/Delete?userId',
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: global_router_view_url,
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
    "pageNumber": 0,
    "pageSize": 8,
    "sortingExpression": "",
    "sortingDirection": 0,
    "enName": "",
    "arName": ""
  }

  clientStatuslist = [
    { id: null, name: 'shared.all' },
    { id: true, name: 'shared.active' },
    { id: false, name: 'shared.not_active' },
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
    this.pageName.set(global_pageName);
    this.API_getAll();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang);
    this.getBreadCrumb();

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang);
      this.getBreadCrumb();
    });
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
      ]
    }
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'enName', header: this.languageService.translate('client.form.name'), type: EType.text, show: true },
      { keyName: 'enName', header: this.languageService.translate('client.form.userName'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('client.form.action'), type: EType.actions, actions: this.tableActions, show: true },
    ];
    this.columnsSmallTable = [
      { keyName: 'id', header: this.languageService.translate('client.form.userName'), type: EType.id, show: false },
      { keyName: 'enName', header: this.languageService.translate('client.form.name'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'enName', header: this.languageService.translate('client.form.mobile'), type: EType.text, showAs: ETableShow.header },
      { keyName: currentLang === 'ar' ? 'arDescription' : 'enDescription', header: this.languageService.translate('client.form.fullName'), type: EType.editor, showAs: ETableShow.content }
    ];
  }

  openFilter() {
    this.showFilter = true;
  }

  onCloseFilter(event: any) {
    this.showFilter = false;
  }


  API_getAll() {
    this.ApiService.post(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data.dataList;
        this.totalCount = res.data.totalCount;
        this.filteredData = [...this.dataList];
      }
    });
  }

  onPageChange(event: any) {
    console.log(event);
    this.objectSearch.pageNumber = event;
    this.API_getAll();
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
      "enName": "",
      "arName": ""
    };
    this.API_getAll();
    this.showFilter = false;
  }

  reloadGetAllApi(e: any) {
    if (e) {
      this.API_getAll();
    }
  }

}

