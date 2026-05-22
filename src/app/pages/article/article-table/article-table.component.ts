import { Component, inject, signal } from '@angular/core';
import {
  EAction,
  EType,
  IcolHeader,
  ITableAction,
  TableComponent,
} from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import {
  ETableShow,
  IcolHeaderSmallTable,
  TableSmallScreenComponent,
} from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ListPageShellComponent } from '../../../components/list-page-shell/list-page-shell.component';
import { ListPageFilterMixin } from '../../../core/list-page.mixin';

const global_pageName = 'article.pageName';
const global_router_add_url_in_Table = '/article/add';
const global_router_view_url = '/article/view';
const global_router_edit_url = '/article/edit';
const global_API_getAll = 'Content/articles/paginated';
@Component({
  selector: 'app-article-table',
  standalone: true,
  imports: [
    TableComponent,
    PaginationComponent,
    FormsModule,
    TableSmallScreenComponent,
    ListPageShellComponent,
  ],
  templateUrl: './article-table.component.html',
  styleUrl: './article-table.component.scss'
})
export class ArticleTableComponent {
global_router_add_url_in_Table = global_router_add_url_in_Table;
  pageName = signal<string>(global_pageName);
  filterMixin = new ListPageFilterMixin();

  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'Content/articles',
      autoCall: true,
    },
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

  bredCrumb: IBreadcrumb = {
    crumbs: [],
  };

  objectSearch = {
    pageNumber: 1,
    pageSize: 8,
    sortBy: '',
    sortDirection: 'asc' as string,
    searchTerm: '',
  };

  totalCount: number = 0;

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
      {
        keyName: 'id',
        header: this.languageService.translate('Id'),
        type: EType.id,
        show: true,
      },
      {
        keyName: 'enTitle',
        header: this.languageService.translate('article.form.enTitle'),
        type: EType.text,
        show: true,
      },
      {
        keyName: 'arTitle',
        header: this.languageService.translate('article.form.arTitle'),
        type: EType.text,
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
        keyName: 'enTitle',
        header: this.languageService.translate('article.form.enTitle'),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'arTitle',
        header: this.languageService.translate('article.form.arTitle'),
        type: EType.text,
        showAs: ETableShow.header,
      },
      { keyName: 'enContent', header: this.languageService.translate('article.form.desc_en'), type: EType.editor, showAs: ETableShow.content, show: false },
      { keyName: 'arContent', header: this.languageService.translate('article.form.desc_ar'), type: EType.editor, showAs: ETableShow.content, show: false },
  
    ];
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
      ],
    };
  }

  API_getAll() {
    this.ApiService.get(global_API_getAll, this.objectSearch).subscribe(
      (res: any) => {
        if (res) {
          this.dataList = res.data.items;
          this.totalCount = res.data.totalCount;
          this.filteredData = [...this.dataList];
        }
      }
    );
  }

  onPageChange(event: any) {
    console.log(event);
    this.objectSearch.pageNumber = event;
    this.API_getAll();
  }

  onSearch(value: string) {
    this.filterMixin.onSearchChange(value, () => this.API_getAll(), this.objectSearch, 'searchTerm');
  }

  onSubmitFilter() {
    this.objectSearch.pageNumber = 1;
    this.API_getAll();
    this.filterMixin.filtersExpanded = false;
  }

  onChipRemove(key: string) {
    this.filterMixin.removeChip(key, this.objectSearch, () => this.API_getAll());
  }

  reset() {
    this.objectSearch = {
      pageNumber: 1,
      pageSize: 8,
      sortBy: '',
      sortDirection: 'asc',
      searchTerm: '',
    };
    this.filterMixin.searchValue = '';
    this.filterMixin.filterChips = [];
    this.filterMixin.filtersExpanded = false;
    this.API_getAll();
  }
}
