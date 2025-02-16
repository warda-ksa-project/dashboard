import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

const global_pageName='district.pageName'
const global_router_add_url_in_Table ='/settings/district/add'
const global_router_view_url ='settings/district/view'
const global_router_edit_url ='settings/district/edit'
const global_API_getAll ='district/GetAll'
const global_API_delete='district/Delete?requestId'

@Component({
  selector: 'app-district-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent,TitleCasePipe,TranslatePipe, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './district-table.component.html',
  styleUrl: './district-table.component.scss'
})
export class DistrictTableComponent {
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
    name: ""
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
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.getBreadCrumb();
    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'districtId', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'enName', header:  this.languageService.translate('district.form.name_en'), type: EType.text, show: true },
      { keyName: 'arName', header: this.languageService.translate('district.form.name_ar'), type: EType.text, show: true },
      { keyName: 'cityName', header:  this.languageService.translate('district.form.city'), type: EType.text, show: true },
      { keyName: 'enDescription', header:  this.languageService.translate('district.form.desc_en'), type: EType.editor, show: true },
      { keyName: 'arDescription', header:  this.languageService.translate('district.form.desc_ar'), type: EType.editor, show: true },
      { keyName: '', header: this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: 'districtId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'enName', header:this.languageService.translate('district.form.name_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'arName', header: this.languageService.translate('district.form.name_ar'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'cityName', header: this.languageService.translate('district.form.city'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'enDescription', header: this.languageService.translate('district.form.desc_en'), type: EType.editor, showAs: ETableShow.content },
      { keyName: 'arDescription', header:this.languageService.translate('district.form.desc_ar'), type: EType.editor, show: true, showAs: ETableShow.content  },

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
    this.ApiService.get(global_API_getAll).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data;
        // this.totalCount = res.data.totalCount;
        // this.filteredData = [...this.dataList];
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
      name:''
    }
    this.API_getAll();
    this.showFilter = false
  }
}

