import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Roles } from '../../../conts';

const global_pageName='termsAndConditions.pageName';
const global_router_add_url_in_Table ='/settings/terms_conditions/add';
const global_router_view_url ='/settings/terms_conditions/view';
const global_router_edit_url ='/settings/terms_conditions/edit';
const global_API_getAll ='Content/terms/paginated';
const global_API_delete='Content/terms';
@Component({
  selector: 'app-terms-conditions-table',
  standalone: true,
  imports: [TableComponent,TitleCasePipe,TranslatePipe, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent, CommonModule],
  templateUrl: './terms-conditions-table.component.html',
  styleUrl: './terms-conditions-table.component.scss'
})
export class TermsConditionsTableComponent {

  global_router_add_url_in_Table = global_router_add_url_in_Table;
  pageName =signal<string>(global_pageName);
  userRole: string = '';
  isTrader: boolean = false;

  showFilter: boolean = false
  tableActions: ITableAction[] = []
  private ApiService = inject(ApiService)


  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: this.pageName(),
      },
    ]
  }

  objectSearch = {
    pageNumber: 1,
    pageSize: 8,
    sortBy: '',
    sortDirection: 'asc' as string,
    searchTerm: '',
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
    
    // Set table actions based on user role
    if (this.isTrader) {
      // Trader: view only
      this.tableActions = [
        {
          name: EAction.view,
          apiName_or_route: '/terms_conditions/view',
          autoCall: true
        }
      ];
    } else {
      // Admin: full access
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
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'enTitle', header: this.languageService.translate('termsAndConditions.form.title_en'), type: EType.text, show: true },
      { keyName: 'arTitle', header: this.languageService.translate('termsAndConditions.form.title_ar'), type: EType.text, show: true },
      { keyName: 'enContent', header: this.languageService.translate('termsAndConditions.form.desc_en'), type: EType.editor, show: true },
      { keyName: 'arContent', header: this.languageService.translate('termsAndConditions.form.desc_ar'), type: EType.editor, show: true },
    ];
    
    // Only show actions column for non-trader users
    if (!this.isTrader) {
      this.columns.push({ keyName: '', header: 'Actions', type: EType.actions, actions: this.tableActions, show: true });
    }

    this.columnsSmallTable = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'enTitle', header: this.languageService.translate('termsAndConditions.form.title_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'arTitle', header: this.languageService.translate('termsAndConditions.form.title_ar'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'enContent', header: this.languageService.translate('termsAndConditions.form.desc_en'), type: EType.editor, showAs: ETableShow.content },
      { keyName: 'arContent', header: this.languageService.translate('termsAndConditions.form.desc_ar'), type: EType.editor, showAs: ETableShow.content }
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
  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

  API_getAll() {
    this.ApiService.get(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data.items;
        this.totalCount = res.data.totalCount;
        this.filteredData = [...this.dataList];
      }

    })
  }

  onPageChange(event: any) {
    console.log(event);
    this.objectSearch.pageNumber = event;
    this.API_getAll();
  }

}



