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

const global_pageName='about_us.pageName'
const global_router_add_url_in_Table ='/about-us/add'
const global_router_view_url ='about-us/view'
const global_router_edit_url ='about-us/edit'
const global_API_getAll ='Content/about-us/paginated'
const global_API_delete='Content/about-us'

@Component({
  selector: 'app-about-us-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent, TranslatePipe, FormsModule, TableSmallScreenComponent, ListPageShellComponent],
  templateUrl: './about-us-table.component.html',
  styleUrl: './about-us-table.component.scss'
})
export class AboutUsTableComponent {

  global_router_add_url_in_Table =global_router_add_url_in_Table
  pageName =signal<string>(global_pageName);
  userRole: string = '';
  isTrader: boolean = false;
  filterMixin = new ListPageFilterMixin();

  tableActions: ITableAction[] = []
  private ApiService = inject(ApiService)


  bredCrumb: IBreadcrumb = {
    crumbs: [
    ]
  }

  objectSearch = {
    pageNumber: 1,
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
    this.userRole = localStorage.getItem('role') || '';
    this.isTrader = this.userRole === Roles.trader;
    
    if (this.isTrader) {
      this.tableActions = [
        {
          name: EAction.view,
          apiName_or_route: global_router_view_url,
          autoCall: true
        }
      ];
    } else {
      this.tableActions = [
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
      ];
    }
    
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
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'image', header: this.languageService.translate('about_us.form.image'), type: EType.image, show: false },
      { keyName: 'enTitle', header: this.languageService.translate('about_us.form.name_en'), type: EType.text, show: true },
      { keyName: 'arTitle', header: this.languageService.translate('about_us.form.name_ar'), type: EType.text, show: true },
    ];
    
    if (!this.isTrader) {
      this.columns.push({ keyName: '', header: this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true });
    }

    this.columnsSmallTable = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'image', header: this.languageService.translate('about_us.form.image'), type: EType.image, show: false, showAs: ETableShow.header },
      { keyName: 'enTitle', header: this.languageService.translate('about_us.form.name_en'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'arTitle', header: this.languageService.translate('about_us.form.name_ar'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'enContent', header: this.languageService.translate('about_us.form.desc_en'), type: EType.editor, showAs: ETableShow.content, show: false },
      { keyName: 'arContent', header: this.languageService.translate('about_us.form.desc_ar'), type: EType.editor, showAs: ETableShow.content, show: false },
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
      { key: 'enName', label: 'about_us.form.name_en', value: this.objectSearch.enName },
      { key: 'arName', label: 'about_us.form.name_ar', value: this.objectSearch.arName },
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
      pageNumber: 1,
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      enName: "",
      arName: ""
    };
    this.filterMixin.searchValue = '';
    this.filterMixin.filterChips = [];
    this.filterMixin.filtersExpanded = false;
    this.API_getAll();
  }
}
