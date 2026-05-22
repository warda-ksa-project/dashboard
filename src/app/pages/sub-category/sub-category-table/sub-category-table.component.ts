import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Roles } from '../../../conts';
import { ListPageShellComponent } from '../../../components/list-page-shell/list-page-shell.component';
import { ListPageFilterMixin } from '../../../core/list-page.mixin';

const global_pageName = 'sub_category.pageName';
const global_router_add_url_in_Table = '/sub-category/add';
const global_router_view_url = '/sub-category/view';
const global_router_edit_url = '/sub-category/edit';
const global_API_getAll = 'SubCategories/paginated';
@Component({
  selector: 'app-sub-category-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent, TranslatePipe, FormsModule, TableSmallScreenComponent, ListPageShellComponent],
  templateUrl: './sub-category-table.component.html',
  styleUrl: './sub-category-table.component.scss'
})
export class SubCategoryTableComponent {
 global_router_add_url_in_Table =global_router_add_url_in_Table
  pageName =signal<string>(global_pageName);
  filterMixin = new ListPageFilterMixin();

  tableActions: ITableAction[] = [
     {
       name: EAction.delete,
       apiName_or_route: 'SubCategories',
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
    crumbs: [
    ]
  }

  objectSearch = {
    "pageNumber": 1,
    "pageSize": 8,
    "sortingExpression": "",
    "sortingDirection": 0,
     "enName": "",
     "arName": ""
  }

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = []
  columns: IcolHeader[] = [];

  columnsSmallTable: IcolHeaderSmallTable[] = []
role=''
  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set(global_pageName)
    this.API_getAll();
    this.getBreadCrumb();
    this.getRoles()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang);
      this.getBreadCrumb();
      this.getRoles()
    })
  }
  getRoles() {
    this.ApiService.get('Auth/roles').subscribe((res: any) => {
      this.role = res?.data ?? res;
    });
  }
  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'enName', header: this.languageService.translate('sub_category.form.enName'), type: EType.text, show: true },
      { keyName: 'arName', header: this.languageService.translate('sub_category.form.arName'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];
    this.columnsSmallTable = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'enName', header: this.languageService.translate('sub_category.form.enName'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'arName', header: this.languageService.translate('sub_category.form.arName'), type: EType.text, showAs: ETableShow.header },
    ];
  }


  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label:  this.languageService.translate('Home'),
          routerLink:  this.role==Roles.admin?'/dashboard-admin':'/dashboard-trader',
        },
        {
          label: this.languageService.translate(this.pageName()),
        },
      ]
    }
  }

  API_getAll() {
    this.ApiService.get(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      const d = res?.data ?? res;
      if (d) {
        this.dataList = d.items ?? d ?? [];
        this.totalCount = d.totalCount ?? this.dataList.length;
        this.filteredData = [...this.dataList];
      }
    });
  }

  onPageChange(event: any) {
    this.objectSearch.pageNumber = event;
    this.API_getAll();
  }

  onSearch(value: string) {
    this.filterMixin.onSearchChange(value, () => this.API_getAll(), this.objectSearch, 'enName');
  }

  onSubmitFilter() {
    this.filterMixin.updateChips([
      { key: 'enName', label: 'sub_category.form.enName', value: this.objectSearch.enName },
      { key: 'arName', label: 'sub_category.form.arName', value: this.objectSearch.arName },
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

}
