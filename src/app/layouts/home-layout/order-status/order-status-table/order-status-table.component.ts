import { Component, inject, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../../components/table/table.component';
import { ApiService } from '../../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { IBreadcrumb } from '../../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../../components/breadcrump/breadcrump.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../../components/table-small-screen/table-small-screen.component';
import { DrawerComponent } from '../../../../components/drawer/drawer.component';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';

const global_pageName = 'orderStatus.pageName';

@Component({
  selector: 'app-order-status-table',
  standalone: true,
  imports: [TableComponent, TranslatePipe, TitleCasePipe, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './order-status-table.component.html',
  styleUrl: './order-status-table.component.scss'
})
export class OrderStatusTableComponent {
pageName = signal<string>(global_pageName);

  showFilter: boolean = false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'orderStatus/Delete?id',
      autoCall: true
    },
    {
      name: EAction.view,
      apiName_or_route: '/orderStatus/view',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: '/orderStatus/edit',
      autoCall: true
    }
  ]
  private ApiService = inject(ApiService)
  private router = inject(Router)


  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  faqSearchCreteria = {
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
  faqsList: any = []
  columns: IcolHeader[] = [];

  columnsSmallTable: IcolHeaderSmallTable[] = []

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.getAllFAQS();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)

    })
  }

  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'titleEn', header: this.languageService.translate('orderStatus.form.name_en'), type: EType.text, show: true },
      { keyName: 'titleAr', header: this.languageService.translate('orderStatus.form.name_ar'), type: EType.text, show: true },
      { keyName: '', header: this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true },

    ]
    this.columnsSmallTable = [
      { keyName: 'titleEn', header: this.languageService.translate('orderStatus.form.name_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'id', header: 'Id', type: EType.id, show: false },
      { keyName: 'titleAr', header: this.languageService.translate('orderStatus.form.name_ar'), type: EType.editor, showAs: ETableShow.content },
    ];
  }

  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

  getAllFAQS() {
    this.ApiService.post('orderStatus/GetAllStatusWithPagination', this.faqSearchCreteria).subscribe((res: any) => {
      if (res) {
        this.faqsList = res.data.dataList;
        this.totalCount = res.data.totalCount;
        this.filteredData = [...this.faqsList];
      }

    })
    // this.ApiService.get('FAQ/GetAll').subscribe((res: any) => {
    //   if (res.data) {
    //     this.faqsList = res.data;
    //   }

    // })
  }

  onPageChange(event: any) {
    console.log(event);
    this.faqSearchCreteria.pageNumber = event;
    this.getAllFAQS();
  }

  onSubmit() {
    console.log("Form Submitted:", this.faqSearchCreteria);
    this.getAllFAQS();
  }

  reset() {
    this.faqSearchCreteria = {
      pageNumber: 0,
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      titleEn: "",
      titleAr: ""
    }
    this.getAllFAQS();
    this.showFilter = false
  }
}
