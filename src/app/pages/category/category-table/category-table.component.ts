import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { NgFor, TitleCasePipe } from '@angular/common';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { ApiService } from '../../../services/api.service';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogComponent } from "../../../components/dialog/dialog.component";
import { CategoryDetailsComponent } from '../category-details/category-details.component';
import { PageDialogComponent } from '../../../components/page-dialog/page-dialog.component';

const global_pageName = 'category.pageName';
const global_router_add_url_in_Table = '/category/add';
const global_router_view_url = '/category/view';
const global_router_edit_url = '/category/edit';
const global_API_getAll = 'Categories/paginated';
@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [
    TableComponent,
    TitleCasePipe,
    TranslatePipe,
    PaginationComponent,
    FormsModule,
    DrawerComponent,
    BreadcrumpComponent,
    RouterModule,
    InputTextModule,
    TableSmallScreenComponent,
    NgFor,
],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.scss'
})
export class CategoryTableComponent {
  global_router_add_url_in_Table = global_router_add_url_in_Table
  pageName = signal<string>(global_pageName);

  showFilter: boolean = false
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
    pageNumber: 1,
    pageSize: 8,
    sortingExpression: '',
    sortingDirection: 0,
    enName: '',
    arName: ''
  };

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
          label:  this.languageService.translate('Home'),
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
      { keyName: currentLang === 'ar' ? 'arName' : 'enName', header: this.languageService.translate('category.form.name'), type: EType.text, show: true },
      { keyName: currentLang === 'ar' ? 'enName' : 'arName', header: this.languageService.translate('category.form.name_ar'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];
    this.columnsSmallTable = [
      { keyName: 'id', header: 'Id', type: EType.id, show: false },
      { keyName: 'enName', header: this.languageService.translate('category.form.name'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'arName', header: this.languageService.translate('category.form.name_ar'), type: EType.text, showAs: ETableShow.content },
    ];
  }

  openFilter() {
    this.showFilter = true;
  }

  onCloseFilter(event: any) {
    this.showFilter = false;
  }


  API_getAll() {
    this.ApiService.get(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      const d = res?.data;
      if (d) {
        this.dataList = d.items ?? d ?? [];
        this.totalCount = d.totalCount ?? 0;
        this.filteredData = [...this.dataList];
      }
    });
  }

  onPageChange(event: any) {
    console.log(event);
    this.objectSearch.pageNumber = event;
    this.API_getAll();
  }

  onSubmitFilter() {
    this.API_getAll();
  }

  reset() {
    this.objectSearch = { pageNumber: 1, pageSize: 8, sortingExpression: '', sortingDirection: 0, enName: '', arName: '' };
    this.API_getAll();
    this.showFilter = false;
  }

  reloadGetAllApi(e: any) {
    if (e) {
      this.API_getAll();
    }
  }

}
