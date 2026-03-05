import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, IToggleOptions, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

const global_pageName = 'currency.pageName';
const global_router_add_url_in_Table = '/currency/add';
const global_router_view_url = 'currency/view';
const global_router_edit_url = 'currency/edit';
const global_API_getAll = 'Currencies';
const global_API_delete = 'Currencies';
const global_toggleOptions: IToggleOptions = {
  apiName: 'Currencies',
  autoCall: true,
};

@Component({
  selector: 'app-currencies-table',
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
  ],
  templateUrl: './currencies-table.component.html',
  styleUrl: './currencies-table.component.scss',
})
export class CurrenciesTableComponent {
  pageName = signal<string>('currency.pageName');
  global_router_add_url_in_Table = global_router_add_url_in_Table;
  showFilter = false;

  tableActions: ITableAction[] = [
    { name: EAction.delete, apiName_or_route: global_API_delete, autoCall: true },
    { name: EAction.view, apiName_or_route: global_router_view_url, autoCall: true },
    { name: EAction.edit, apiName_or_route: global_router_edit_url, autoCall: true },
  ];

  private ApiService = inject(ApiService);
  bredCrumb: IBreadcrumb = {
    crumbs: [
      { label: 'Home', routerLink: '/dashboard' },
      { label: 'Currencies' },
    ],
  };

  objectSearch = {
    pageNumber: 1,
    pageSize: 8,
    sortingExpression: '',
    sortingDirection: 0,
    enName: '',
    arName: '',
  };

  totalCount = 0;
  searchValue: any = '';
  filteredData: any;
  dataList: any = [];
  columns: IcolHeader[] = [];
  columnsSmallTable: IcolHeaderSmallTable[] = [];
  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set(global_pageName);
    this.API_getAll();
    this.getBreadCrumb();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang);
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang);
      this.getBreadCrumb();
    });
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'image', header: this.languageService.translate('currency.form.image'), type: EType.image, show: false },
      { keyName: currentLang === 'ar' ? 'arName' : 'enName', header: this.languageService.translate('currency.form.name_en'), type: EType.text, show: true },
      { keyName: 'code', header: this.languageService.translate('currency.form.code'), type: EType.text, show: true },
      { keyName: 'symbol', header: this.languageService.translate('currency.form.symbol'), type: EType.text, show: true },
      { keyName: 'status', header: this.languageService.translate('currency.form.status'), type: EType.toggle, toggleOptions: global_toggleOptions, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable = [
      { keyName: currentLang === 'ar' ? 'arName' : 'enName', header: this.languageService.translate('currency.form.name_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'code', header: this.languageService.translate('currency.form.code'), type: EType.text, showAs: ETableShow.content, show: true },
      { keyName: 'status', header: this.languageService.translate('currency.form.status'), type: EType.status, toggleOptions: global_toggleOptions, show: true },
    ];
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        { label: this.languageService.translate('Home'), routerLink: '/dashboard' },
        { label: this.languageService.translate(this.pageName()) },
      ],
    };
  }

  openFilter() {
    this.showFilter = true;
  }

  onCloseFilter(event: any) {
    this.showFilter = false;
  }

  API_getAll() {
    this.ApiService.get(global_API_getAll).subscribe((res: any) => {
      const d = res?.data ?? res;
      const list = Array.isArray(d) ? d : d?.items ?? [];
      this.dataList = list;
      this.totalCount = list.length;
      this.filteredData = [...this.dataList];
    });
  }

  onPageChange(event: any) {
    this.objectSearch.pageNumber = event;
    this.API_getAll();
  }

  filterData() {
    const search = (this.searchValue || '').toLowerCase();
    if (!search) {
      this.dataList = this.filteredData;
      return;
    }
    this.dataList = this.filteredData.filter(
      (item: any) =>
        (item.enName || '').toLowerCase().includes(search) ||
        (item.arName || '').toLowerCase().includes(search) ||
        (item.code || '').toLowerCase().includes(search)
    );
  }

  onSubmitFilter() {
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      pageNumber: 1,
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
