import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { TranslatePipe } from '@ngx-translate/core';
import { ListPageShellComponent } from '../../../components/list-page-shell/list-page-shell.component';
import { ListPageFilterMixin } from '../../../core/list-page.mixin';
import { SignalRService } from '../../../services/signalr.service';
import { Subscription } from 'rxjs';

const global_pageName = 'trader_request.pageName';
const global_router_add_url_in_Table = '/traderRequest/add';
const global_router_view_url = '/traderRequest/view';
const global_API_getAll = 'Traders/requests';
@Component({
  selector: 'app-trader-requests-table',
  standalone: true,
  imports: [
    TableComponent,
    PaginationComponent,
    TranslatePipe,
    FormsModule,
    TableSmallScreenComponent,
    ListPageShellComponent,
  ],
  templateUrl: './trader-requests-table.component.html',
  styleUrl: './trader-requests-table.component.scss',
})
export class TraderRequestsTableComponent implements OnInit, OnDestroy {
  global_router_add_url_in_Table = global_router_add_url_in_Table;
  pageName = signal<string>(global_pageName);
  filterMixin = new ListPageFilterMixin();
  tableActions: ITableAction[] = [
    {
      name: EAction.view,
      apiName_or_route: global_router_view_url,
      autoCall: true,
    },
    // {
    //   name: EAction.edit,
    //   apiName_or_route: global_router_edit_url,
    //   autoCall: true,
    // },
  ];
  private ApiService = inject(ApiService);

  bredCrumb: IBreadcrumb = {
    crumbs: [],
  };

  objectSearch = {
    pageNumber: 1,
    pageSize: 8,
    searchTerm: '',
    sortBy: '',
    sortDirection: 'asc',
    storeName: ''
  };

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = [];
  columns: IcolHeader[] = [];

  columnsSmallTable: IcolHeaderSmallTable[] = [];

  selectedLang: any;
  languageService = inject(LanguageService);
  private signalR = inject(SignalRService);
  private signalRSub?: Subscription;

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
    this.signalRSub = this.signalR.dashboardUpdate$.subscribe((update) => {
      if (this.signalR.isTraderRequestUpdate(update)) {
        this.API_getAll();
      }
    });
  }

  ngOnDestroy(): void {
    this.signalRSub?.unsubscribe();
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
        keyName: 'traderName',
        header: this.languageService.translate('trader_request.form.traderName'),
        type: EType.text,
        show: true,
      },
      {
        keyName: 'addedDate',
        header: this.languageService.translate('trader_request.form.addedDate'),
        type: EType.date,
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
        keyName: 'traderName',
        header: this.languageService.translate('trader_request.form.traderName'),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'addedDate',
        header: this.languageService.translate('trader_request.form.addedDate'),
        type: EType.date,
        showAs: ETableShow.header,
      },
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
    this.objectSearch.pageNumber = event;
    this.API_getAll();
  }

  onSearch(value: string) {
    this.filterMixin.onSearchChange(value, () => this.API_getAll(), this.objectSearch, 'searchTerm');
  }

  onSubmitFilter() {
    this.filterMixin.updateChips([
      { key: 'storeName', label: 'trader.form.storeName', value: this.objectSearch.storeName },
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
      searchTerm: '',
      sortBy: '',
      sortDirection: 'asc',
      storeName: '',
    };
    this.filterMixin.searchValue = '';
    this.filterMixin.filterChips = [];
    this.filterMixin.filtersExpanded = false;
    this.API_getAll();
  }
}
