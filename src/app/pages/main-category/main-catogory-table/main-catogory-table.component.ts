import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';
import { ListPageShellComponent } from '../../../components/list-page-shell/list-page-shell.component';
import { ListPageFilterMixin } from '../../../core/list-page.mixin';

const global_pageName = 'category.pageName';
const global_router_add_url_in_Table = '/main_category/add';
const global_router_view_url = '/main_category/view';
const global_router_edit_url = '/main_category/edit';
const global_API_getAll = 'Categories/paginated';

@Component({
  selector: 'app-main-catogory-table',
  standalone: true,
  imports: [
    TableComponent,
    TranslatePipe,
    PaginationComponent,
    FormsModule,
    TableSmallScreenComponent,
    ListPageShellComponent,
  ],
  templateUrl: './main-catogory-table.component.html',
  styleUrl: './main-catogory-table.component.scss'
})
export class MainCatogoryTableComponent {

  global_router_add_url_in_Table = global_router_add_url_in_Table
  pageName = signal<string>(global_pageName);
  filterMixin = new ListPageFilterMixin();

  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'Categories',
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
    "pageNumber": 1,
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
      { keyName: 'enName', header: this.languageService.translate('category.form.enName'), type: EType.text, show: true },
      { keyName: 'arName', header: this.languageService.translate('category.form.arName'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];
    this.columnsSmallTable = [
      { keyName: 'id', header: this.languageService.translate('category.form.userName'), type: EType.id, show: false },
      { keyName: 'enName', header: this.languageService.translate('category.form.enName'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'arName', header: this.languageService.translate('category.form.arName'), type: EType.text, showAs: ETableShow.header },
    ];
  }

  API_getAll() {
    this.ApiService.get(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data.items;
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

  onSearch(value: string) {
    this.filterMixin.onSearchChange(value, () => this.API_getAll(), this.objectSearch, 'enName');
  }

  onSubmitFilter() {
    this.filterMixin.updateChips([
      { key: 'enName', label: 'category.form.enName', value: this.objectSearch.enName },
      { key: 'arName', label: 'category.form.arName', value: this.objectSearch.arName },
    ]);
    this.objectSearch.pageNumber = 1;
    this.API_getAll();
    this.filterMixin.filtersExpanded = false;
  }

  onChipRemove(key: string) {
    this.filterMixin.removeChip(key, this.objectSearch, () => this.API_getAll());
  }

  reset() {
    this.objectSearch = {
      "pageNumber": 1,
      "pageSize": 8,
      "sortingExpression": "",
      "sortingDirection": 0,
      "enName": "",
      "arName": ""
    };
    this.filterMixin.searchValue = '';
    this.filterMixin.filterChips = [];
    this.filterMixin.filtersExpanded = false;
    this.API_getAll();
  }

  reloadGetAllApi(e: any) {
    if (e) {
      this.API_getAll();
    }
  }

}
