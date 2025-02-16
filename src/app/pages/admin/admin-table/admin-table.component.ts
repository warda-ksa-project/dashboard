import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, IToggleOptions, TableComponent } from '../../../components/table/table.component';
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
import { TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

const global_pageName='admin.pageName'
const global_router_add_url_in_Table ='/settings/admin/add'
const global_router_view_url ='settings/admin/view'
const global_router_edit_url ='settings/admin/edit'
const global_API_getAll ='admin/GetAllWithPagination'
const global_API_deialis =  'admin/GetById';
const global_toggleOptions:IToggleOptions={
apiName:"Admin"+'/Update',
autoCall:true,
}
@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent,TitleCasePipe,TranslatePipe, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.scss'
})
export class AdminTableComponent {
global_router_add_url_in_Table =global_router_add_url_in_Table
  pageName =signal<string>(global_pageName);

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    // {
    //   name: EAction.delete,
    //   apiName_or_route: global_API_delete,
    //   autoCall: true
    // },
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
    crumbs: []
  }

  objectSearch = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    isActive: null,
    fullName: "",
    userName: "",
    email: ""  }

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
    this.getBreadCrumb();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.getBreadCrumb();

    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'userId', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'fullName', header: this.languageService.translate('admin.form.fullName'), type: EType.text, show: true },
      { keyName: 'email', header:this.languageService.translate('admin.form.email'), type: EType.text, show: true },
      { keyName: 'userName', header: this.languageService.translate('admin.form.userName'), type: EType.text, show: true },
      { keyName: 'isActive', header: this.languageService.translate('admin.form.status'), type: EType.toggle, toggleOptions:global_toggleOptions, show: true },
      { keyName: '', header: this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: 'userId', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'fullName', header: this.languageService.translate('admin.form.fullName'), type: EType.text, show: true },
      { keyName: 'email', header: this.languageService.translate('admin.form.email'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'userName', header: this.languageService.translate('admin.form.userName'), type: EType.text, showAs: ETableShow.header },
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

  // updateStatusManualy(event:any){
  //      console.log("AdminTableComponent  updateStatusManualy  item:", event)
  //      this.ApiService.get(global_API_deialis+'/'+event.record.userId).subscribe((res:any)=>{
  //       if(res.data){
  //         this.ApiService.put(global_toggleOptions.apiName,{...res.data,isActive:event.status}).subscribe()
  //       }
  //      })
  // }

  API_getAll() {
    this.ApiService.post(global_API_getAll,this.objectSearch).subscribe((res: any) => {
      if (res) {
        this.dataList = res.data.dataList;
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
      isActive: null,
      fullName: "",
      userName: "",
      email: ""
    }
    this.API_getAll();
    this.showFilter = false
  }
}

