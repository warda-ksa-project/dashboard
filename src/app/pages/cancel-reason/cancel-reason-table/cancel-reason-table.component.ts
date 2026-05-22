import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ListPageShellComponent } from '../../../components/list-page-shell/list-page-shell.component';
import { ListPageFilterMixin } from '../../../core/list-page.mixin';

@Component({
  selector: 'app-cancel-reason-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent, TranslatePipe, FormsModule, TableSmallScreenComponent, ListPageShellComponent],
  templateUrl: './cancel-reason-table.component.html',
  styleUrl: './cancel-reason-table.component.scss'
})
export class CancelReasonTableComponent {
  pageName =signal<string>('');
  filterMixin = new ListPageFilterMixin();

  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'CancelReasons',
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: 'cancel-reason/view',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: 'cancel-reason/edit',
      autoCall: true
    }
  ]
  private ApiService = inject(ApiService)


  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'Cancel Reason',
      },
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
    this.pageName.set('cancel_reason.pageName')
    this.getAllCancelReason();
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
      { keyName: 'enReason', header: this.languageService.translate('cancel_reason.form.reason_en'), type: EType.text, show: true },
      { keyName: 'arReason', header: this.languageService.translate('cancel_reason.form.reason_ar'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true }
    ];

    this.columnsSmallTable = [
      { keyName: currentLang === 'ar' ? 'arReason' : 'enReason', header: this.languageService.translate('cancel_reason.form.reason_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: currentLang === 'ar' ? 'enReason' : 'arReason', header: this.languageService.translate('cancel_reason.form.reason_ar'), type: EType.text, showAs: ETableShow.content }
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

  getAllCancelReason() {
    this.ApiService.get('CancelReasons/paginated', this.objectSearch).subscribe((res: any) => {
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
    this.getAllCancelReason();
  }

  onSearch(value: string) {
    this.filterMixin.onSearchChange(value, () => this.getAllCancelReason(), this.objectSearch, 'enName');
  }

  onSubmitFilter() {
    this.filterMixin.updateChips([
      { key: 'enName', label: 'cancel_reason.form.reason_en', value: this.objectSearch.enName },
      { key: 'arName', label: 'cancel_reason.form.reason_ar', value: this.objectSearch.arName },
    ]);
    this.objectSearch.pageNumber = 1;
    this.getAllCancelReason();
    this.filterMixin.filtersExpanded = false;
  }

  onChipRemove(key: string) {
    this.filterMixin.removeChip(key, this.objectSearch, () => this.getAllCancelReason());
  }

  reset() {
    this.objectSearch = {
      pageNumber: 1,
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      enName: "",
      arName: ""
    }
    this.filterMixin.searchValue = '';
    this.filterMixin.filterChips = [];
    this.filterMixin.filtersExpanded = false;
    this.getAllCancelReason();
  }

}
