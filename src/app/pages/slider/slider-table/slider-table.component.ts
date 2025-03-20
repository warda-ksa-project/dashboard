import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
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
import { coponeOfferTypeList, coponeTypeList } from '../../../conts';
import { TranslatePipe } from '@ngx-translate/core';
import { DrawerComponent } from '../../../components/drawer/drawer.component';

const global_pageName = 'slider.pageName'
const global_router_add_url_in_Table = "slider/add"
const global_router_view_url = "slider" + '/view'
const global_router_edit_url = "slider" + '/edit'
const global_API_getAll = "slider" + '/GetAllWithPagination'
const global_API_delete = "slider" + '/Delete?Id'
@Component({
  selector: 'app-slider-table',
  standalone: true,
  imports: [TableComponent, TitleCasePipe, PaginationComponent,DrawerComponent, TranslatePipe, FormsModule, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './slider-table.component.html',
  styleUrl: './slider-table.component.scss'
})

export class SliderTableComponent {
  global_router_add_url_in_Table = global_router_add_url_in_Table
  pageName = signal<string>(global_pageName);
 private router =inject(Router)
  showFilter: boolean = false
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
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    titleEn: "",
    titleAr: ""
  }

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = []
  columns: IcolHeader[] = [];
  offerTypeList: any[] = coponeOfferTypeList
  coponeTypeList: any[] = coponeTypeList
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
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'imageEn', header: this.languageService.translate('slider.form.img_en'), type: EType.image, show: true },
      { keyName: 'imageAr', header: this.languageService.translate('slider.form.img_ar'), type: EType.image, show: true },
      { keyName: 'titleEn', header: this.languageService.translate('slider.form.title_en'), type: EType.text, show: true },
      { keyName: 'titleAr', header: this.languageService.translate('slider.form.title_ar'), type: EType.text, show: true },
      { keyName: 'displayOrder', header: this.languageService.translate('slider.form.displayOrder'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'titleEn', header: this.languageService.translate('slider.form.title_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'titleAr', header: this.languageService.translate('slider.form.title_ar'), type: EType.text, showAs: ETableShow.header },
      // { keyName: 'imageEn', header: 'Image (en)', type: EType.image, showAs: ETableShow.content },
      // { keyName: 'imageAr', header: 'Image (ar)', type: EType.image, showAs: ETableShow.content },
      { keyName: 'displayOrder', header: this.languageService.translate('slider.form.displayOrder'), type: EType.text, showAs: ETableShow.content },

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
  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

  API_getAll() {
    // this.ApiService.get(global_API_getAll).subscribe((res: any) => {
    //   if (res) {
    //     this.dataList = res;
    //     this.totalCount = res.totalCount;
    //     this.filteredData = [...this.dataList];
    //   }

    // })
    this.ApiService.post(global_API_getAll, this.objectSearch).subscribe((res: any) => {
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

  addPage(){
    this.router.navigateByUrl(global_router_add_url_in_Table)
  }
  reset() {
    this.objectSearch = {
      pageNumber: 0,
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      titleEn: "",
      titleAr: ""

    }
    this.API_getAll();
    this.showFilter = false
  }
}


