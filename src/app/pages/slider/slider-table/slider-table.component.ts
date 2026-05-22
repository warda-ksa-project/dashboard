import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ListPageShellComponent } from '../../../components/list-page-shell/list-page-shell.component';
import { ListPageFilterMixin } from '../../../core/list-page.mixin';

const global_pageName = 'slider.pageName'
const global_router_add_url_in_Table = '/slider/add'
const global_router_view_url = "slider" + '/view'
const global_router_edit_url = "slider" + '/edit'
const global_API_getAll = 'Sliders/paginated'
const global_API_delete = 'Sliders'
@Component({
  selector: 'app-slider-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent, FormsModule, TableSmallScreenComponent, ListPageShellComponent],
  templateUrl: './slider-table.component.html',
  styleUrl: './slider-table.component.scss'
})

export class SliderTableComponent {
  global_router_add_url_in_Table = global_router_add_url_in_Table
  pageName = signal<string>(global_pageName);
  filterMixin = new ListPageFilterMixin();

  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: global_API_delete,
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
    pageNumber: 1,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    searchTerm: ""
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
    this.getBreadCrumb()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.getBreadCrumb()

    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'id', header: 'Id', type: EType.id, show: true },
      { keyName: 'image', header: 'slider.form.img', type: EType.image, show: true },
      { keyName: 'url', header: 'slider.form.url', type: EType.text, show: true },
      { keyName: 'displayOrder', header: 'slider.form.displayOrder', type: EType.text, show: true },
      { keyName: 'isActive', header: 'slider.form.isActive', type: EType.boolean, show: true },
      { keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true }
    ];
    this.columnsSmallTable = [
      { keyName: 'id', header: 'Id', type: EType.id, show: false },
      { keyName: 'url', header: 'slider.form.url', type: EType.text, showAs: ETableShow.header },
      { keyName: 'displayOrder', header: 'slider.form.displayOrder', type: EType.text, showAs: ETableShow.content }
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
      sortingExpression: "",
      sortingDirection: 0,
      searchTerm: ""
    };
    this.filterMixin.searchValue = '';
    this.filterMixin.filterChips = [];
    this.filterMixin.filtersExpanded = false;
    this.API_getAll();
  }
}
