import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, IToggleOptions, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TitleCasePipe } from '@angular/common';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { TranslatePipe } from '@ngx-translate/core';

const global_pageName='country'
const global_router_add_url_in_Table ='/'+global_pageName+'/add'
const global_router_view_url =global_pageName+'/view'
const global_router_edit_url =global_pageName+'/edit'
const global_API_getAll =global_pageName+'/GetAll'
const global_API_delete=global_pageName+'/delete?id'
const global_toggleOptions:IToggleOptions={
apiName:global_pageName+'/update',
autoCall:true,
}
@Component({
  selector: 'app-countries-table',
  standalone: true,
  imports: [TableComponent,TitleCasePipe,TranslatePipe, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './countries-table.component.html',
  styleUrl: './countries-table.component.scss'
})
export class CountriesTableComponent {
  pageName =signal<string>('country.pageName');
  global_router_add_url_in_Table =global_router_add_url_in_Table
  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: global_API_delete,
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route:  global_router_view_url,
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
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label:'Countries'
      },
    ]
  }

  objectSearch = {
    pageNumber: 0,
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
    this.pageName.set('country.pageName')
    this.API_getAll();
    this.getBreadCrumb();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang);
      this.getBreadCrumb();
    })
  }


  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'img', header: this.languageService.translate('country.form.image'), type: EType.image, show: false },
      { keyName: currentLang === 'ar' ? 'arName' : 'enName', header: this.languageService.translate('country.form.name_en'), type: EType.text, show: true },
      { keyName: 'phoneLength', header: this.languageService.translate('country.form.phoneLength'), type: EType.text, show: true },
      { keyName: 'phoneCode', header: this.languageService.translate('country.form.phoneCode'), type: EType.text, show: true },
      // { keyName: 'shortName', header: this.languageService.translate('country.form.shortName'), type: EType.text, show: true },
      { keyName: 'status', header: this.languageService.translate('country.form.status'), type: EType.toggle, toggleOptions: global_toggleOptions, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true }
    ];

    this.columnsSmallTable = [
      { keyName: currentLang === 'ar' ? 'arName' : 'enName', header: this.languageService.translate('country.form.name_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: currentLang === 'ar' ? 'arDescription' : 'enDescription', header: this.languageService.translate('country.form.content'), type: EType.editor, showAs: ETableShow.content },
      { keyName: 'status', header: this.languageService.translate('form.status'), type: EType.status, toggleOptions: global_toggleOptions, show: true },
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
    // this.ApiService.post(global_API_getAll, this.objectSearch).subscribe((res: any) => {
    //   if (res) {
    //     this.dataList = res.data.dataList;
    //     this.totalCount = res.data.totalCount;
    //     this.filteredData = [...this.dataList];
    //   }

    // })
    this.ApiService.get(global_API_getAll).subscribe((res: any) => {
      if (res) {
        this.dataList = res;
      }

    })
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

    this.dataList = this.dataList.filter((item: any) =>
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
      sortingExpression: "",
      sortingDirection: 0,
      enName: "",
      arName: ""
    }
    this.API_getAll();
    this.showFilter = false
  }
}






























