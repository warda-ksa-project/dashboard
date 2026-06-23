import { Component, inject, signal } from '@angular/core';
import {
  EAction,
  EType,
  IcolHeader,
  ITableAction,
  IToggleOptions,
  TableComponent,
} from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import {
  ETableShow,
  IcolHeaderSmallTable,
  TableSmallScreenComponent,
} from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ListPageShellComponent } from '../../../components/list-page-shell/list-page-shell.component';
import { ListPageFilterMixin } from '../../../core/list-page.mixin';

const global_pageName = 'users.pageName';
const global_router_add_url_in_Table = '/user/add';
const global_router_view_url = '/user/view';
const global_router_edit_url = '/user/edit';
const global_API_getAll = 'Users/paginated';
const global_toggleOptions: IToggleOptions = {
  apiName: 'Users',
  autoCall: true,
};

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    TableComponent,
    PaginationComponent,
    TranslatePipe,
    FormsModule,
    TableSmallScreenComponent,
    ListPageShellComponent,
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent {
  global_router_add_url_in_Table = global_router_add_url_in_Table;
  pageName = signal<string>(global_pageName);
  filterMixin = new ListPageFilterMixin();

  tableActions: ITableAction[] = [
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
  private ApiService = inject(ApiService);

  bredCrumb: IBreadcrumb = { crumbs: [] };

  objectSearch = {
    pageNumber: 1,
    pageSize: 8,
    sortingExpression: '',
    sortingDirection: 1,
    nameAr: '',
    phone: '',
    searchTerm: '',
  };

  totalCount: number = 0;
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
      {
        keyName: 'id',
        header: this.languageService.translate('Id'),
        type: EType.id,
        show: true,
      },
      {
        keyName: 'userName',
        header: this.languageService.translate('users.form.name'),
        type: EType.text,
        show: true,
      },
      {
        keyName: 'roleName',
        header: this.languageService.translate('users.form.role'),
        type: EType.text,
        show: true,
      },
      {
        keyName: 'email',
        header: this.languageService.translate('users.form.email'),
        type: EType.text,
        show: true,
      },
      {
        keyName: 'phone',
        header: this.languageService.translate('users.form.phone'),
        type: EType.text,
        show: true,
      },
      {
        keyName: 'isActive',
        header: this.languageService.translate('users.form.status'),
        type: EType.toggle,
        toggleOptions: global_toggleOptions,
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
        keyName: 'userName',
        header: this.languageService.translate('users.form.name'),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'roleName',
        header: this.languageService.translate('users.form.role'),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'email',
        header: this.languageService.translate('users.form.email'),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'phone',
        header: this.languageService.translate('users.form.phone'),
        type: EType.text,
        showAs: ETableShow.header,
      },
    ];
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
          routerLink: '/dashboard-admin',
        },
        { label: this.languageService.translate(this.pageName()) },
      ],
    };
  }

  API_getAll() {
    this.ApiService.get(global_API_getAll, this.objectSearch).subscribe(
      (res: any) => {
        if (res) {
          this.dataList = res.data.items;
          this.totalCount = res.data.totalCount;
        }
      },
    );
  }

  onPageChange(event: any) {
    this.objectSearch.pageNumber = event;
    this.API_getAll();
  }

  onSearch(value: string) {
    this.filterMixin.onSearchChange(
      value,
      () => this.API_getAll(),
      this.objectSearch,
      'phone',
    );
  }

  onSubmitFilter() {
    this.filterMixin.updateChips([
      {
        key: 'phone',
        label: 'users.form.phone',
        value: this.objectSearch.phone,
      },
      {
        key: 'nameAr',
        label: 'users.form.name',
        value: this.objectSearch.nameAr,
      },
    ]);
    this.objectSearch.pageNumber = 1;
    this.API_getAll();
    this.filterMixin.filtersExpanded = false;
  }

  onChipRemove(key: string) {
    this.filterMixin.removeChip(key, this.objectSearch, () =>
      this.API_getAll(),
    );
  }

  reset() {
    this.objectSearch = {
      pageNumber: 1,
      pageSize: 8,
      sortingExpression: '',
      sortingDirection: 1,
      nameAr: '',
      phone: '',
      searchTerm: '',
    };
    this.filterMixin.searchValue = '';
    this.filterMixin.filterChips = [];
    this.filterMixin.filtersExpanded = false;
    this.API_getAll();
  }
}
