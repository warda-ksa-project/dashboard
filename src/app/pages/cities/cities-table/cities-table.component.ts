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
  selector: 'app-cities-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent, TranslatePipe, FormsModule, TableSmallScreenComponent, ListPageShellComponent],
  templateUrl: './cities-table.component.html',
  styleUrl: './cities-table.component.scss'
})
export class CitiesTableComponent {
  pageName = signal<string>('');
  filterMixin = new ListPageFilterMixin();
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'Cities',
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: 'city/view',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: 'city/edit',
      autoCall: true
    }
  ]
  private ApiService = inject(ApiService)

  bredCrumb: IBreadcrumb = {
    crumbs: [
    ]
  }

  searchValue: any = '';
  filteredData: any;
  citiesList: any = []
  columns: IcolHeader[] = [];

  columnsSmallTable: IcolHeaderSmallTable[] = []
  totalCount: number = 0;
   citySearch={
    pageNumber: 1,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    enName: "",
    arName: "",
    // postalCode: ""
  }
  selectedLang: any;
  languageService = inject(LanguageService);
  ngOnInit() {
    this.pageName.set('city.pageName')
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.getAllCities();
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
      { keyName: 'enName', header: this.languageService.translate('city.form.name_en'), type: EType.text, show: true },
      { keyName: 'arName', header: this.languageService.translate('city.form.name_ar'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true }
    ];

    this.columnsSmallTable = [
      { keyName: 'enName', header: this.languageService.translate('city.form.name_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'arName', header: this.languageService.translate('city.form.name_ar'), type: EType.text, showAs: ETableShow.content }
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

  getAllCities() {
    this.ApiService.get('Cities/paginated', this.citySearch).subscribe((res: any) => {
      const d = res?.data ?? res;
      if (d) {
        this.citiesList = d.items ?? d ?? [];
        this.totalCount = d.totalCount ?? this.citiesList.length;
        this.filteredData = [...this.citiesList];
      }
    });
  }

  onPageChange(event: any) {
    this.citySearch.pageNumber = event;
    this.getAllCities();
  }

  onSearch(value: string) {
    this.filterMixin.onSearchChange(value, () => this.getAllCities(), this.citySearch, 'enName');
  }

  onSubmitFilter() {
    this.filterMixin.updateChips([
      { key: 'enName', label: 'city.form.name_en', value: this.citySearch.enName },
      { key: 'arName', label: 'city.form.name_ar', value: this.citySearch.arName },
    ]);
    this.citySearch.pageNumber = 1;
    this.getAllCities();
    this.filterMixin.filtersExpanded = false;
  }

  onChipRemove(key: string) {
    this.filterMixin.removeChip(key, this.citySearch, () => this.getAllCities());
  }

  reset() {
    this.citySearch = {
      pageNumber: 1,
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      enName: "",
      arName: "",
    };
    this.filterMixin.searchValue = '';
    this.filterMixin.filterChips = [];
    this.filterMixin.filtersExpanded = false;
    this.getAllCities();
  }
}
