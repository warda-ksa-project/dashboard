import { Component, inject, signal } from '@angular/core';
import {
  EAction,
  EType,
  IcolHeader,
  ITableAction,
  TableComponent,
} from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import {
  ETableShow,
  IcolHeaderSmallTable,
  TableSmallScreenComponent,
} from '../../../components/table-small-screen/table-small-screen.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Roles } from '../../../conts';

const global_pageName = 'piece_products.pageName';
const global_router_add_url_in_Table = '/piece-product/add';
const global_router_view_url = '/piece-product/view';
const global_router_edit_url = '/piece-product/edit';
const global_API_getAll = 'pieceproducts' + '/GetAllWithPagination';
@Component({
  selector: 'app-piece-products-table',
  standalone: true,
  imports: [
    TableComponent,
    TitleCasePipe,
    PaginationComponent,
    TranslatePipe,
    FormsModule,
    DrawerComponent,
    BreadcrumpComponent,
    RouterModule,
    InputTextModule,
    TableSmallScreenComponent,
  ],
  templateUrl: './piece-products-table.component.html',
  styleUrl: './piece-products-table.component.scss',
})
export class PieceProductsTableComponent {
  global_router_add_url_in_Table = global_router_add_url_in_Table;
  pageName = signal<string>(global_pageName);

  showFilter: boolean = false;
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'pieceproducts/Delete?id',
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
  role=''
  bredCrumb: IBreadcrumb = {
    crumbs: [],
  };

  objectSearch = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: '',
    sortingDirection: 0,
    enName: '',
    arName: '',
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
    this.getRoles()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang);
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang);
      this.getBreadCrumb();
      this.getRoles()
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
        keyName: 'enName',
        header: this.languageService.translate('sub_category.form.enName'),
        type: EType.text,
        show: true,
      },
      {
        keyName: 'arName',
        header: this.languageService.translate('sub_category.form.arName'),
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
        keyName: 'enName',
        header: this.languageService.translate('sub_category.form.enName'),
        type: EType.text,
        showAs: ETableShow.header,
      },
      {
        keyName: 'arName',
        header: this.languageService.translate('sub_category.form.arName'),
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
          routerLink:  this.role==Roles.admin?'/dashboard-admin':'/dashboard-trader',
        },
        {
          label: this.languageService.translate(this.pageName()),
        },
      ],
    };
  }
  getRoles(){
    this.ApiService.get('Auth/getRoles').subscribe((res:any)=>{
    this.role=res.message
    })
  }
  openFilter() {
    this.showFilter = true;
  }

  onCloseFilter(event: any) {
    this.showFilter = false;
  }

  API_getAll() {
    this.ApiService.post(global_API_getAll, this.objectSearch).subscribe(
      (res: any) => {
        if (res) {
          this.dataList = res.data.dataList;
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

  filterData() {
    this.dataList = this.filteredData;
    const search = this.searchValue.toLowerCase();

    if (this.searchValue.length == 1) {
      this.dataList = this.filteredData;
      return;
    }

    this.dataList = this.dataList.filter(
      (item: any) =>
        item.enTitle.toLowerCase().includes(search) ||
        item.arTitle.toLowerCase().includes(search) ||
        item.enDescription.toLowerCase().includes(search) ||
        item.arDescription.toLowerCase().includes(search)
    );
  }

  onSubmitFilter() {
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      pageNumber: 0,
      pageSize: 8,
      sortingExpression: '',
      sortingDirection: 0,
      enName: '',
      arName: '',
    };
    this.API_getAll();
    this.showFilter = false;
  }
}
