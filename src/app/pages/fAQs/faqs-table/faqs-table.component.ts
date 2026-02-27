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
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { Roles } from '../../../conts';

const global_pageName = 'faqs.pageName';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [TableComponent, TranslatePipe, TitleCasePipe, PaginationComponent, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent, CommonModule],
  templateUrl: './faqs-table.component.html',
  styleUrl: './faqs-table.component.scss'
})
export class FaqsTableComponent {
  pageName = signal<string>(global_pageName);
  userRole: string = '';
  isTrader: boolean = false;

  showFilter: boolean = false
  tableActions: ITableAction[] = []
  private ApiService = inject(ApiService)
  private router = inject(Router)


  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  faqSearchCreteria = {
    pageNumber: 1,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    enTitle: "",
    arTitle: ""
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
    this.userRole = localStorage.getItem('role') || '';
    this.isTrader = this.userRole === Roles.trader;
    
    // Set table actions based on user role
    if (this.isTrader) {
      // Trader: view only
      this.tableActions = [
        {
          name: EAction.view,
          apiName_or_route: '/faqs/view',
          autoCall: true
        }
      ];
    } else {
      // Admin: full access
      this.tableActions = [
        {
          name: EAction.delete,
          apiName_or_route: 'Content/faqs',
          autoCall: true
        },
        {
          name: EAction.view,
          apiName_or_route: '/faqs/view',
          autoCall: true
        },
        {
          name: EAction.edit,
          apiName_or_route: '/faqs/edit',
          autoCall: true
        }
      ];
    }
    
    this.getAllFAQS();
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
      { keyName: 'enTitle', header: this.languageService.translate('faqs.form.question_en'), type: EType.text, show: true },
      { keyName: 'arTitle', header: this.languageService.translate('faqs.form.question_ar'), type: EType.text, show: true },
      { keyName: 'enDescription', header: this.languageService.translate('faqs.form.desc_en'), type: EType.editor, show: true },
      { keyName: 'arDescription', header: this.languageService.translate('faqs.form.desc_ar'), type: EType.editor, show: true },
    ];
    
    // Only show actions column for non-trader users
    if (!this.isTrader) {
      this.columns.push({ keyName: '', header: this.languageService.translate('Actions'), type: EType.actions, actions: this.tableActions, show: true });
    }

    this.columnsSmallTable = [
      { keyName: 'enTitle', header: this.languageService.translate('faqs.form.question_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'id', header: 'Id', type: EType.id, show: false },
      { keyName: 'arTitle', header: this.languageService.translate('faqs.form.question_ar'), type: EType.editor, showAs: ETableShow.content },
      { keyName: 'enDescription', header: this.languageService.translate('faqs.form.desc_en'), type: EType.editor, showAs: ETableShow.content },
      { keyName: 'arDescription', header: this.languageService.translate('faqs.form.desc_ar'), type: EType.editor, showAs: ETableShow.content }

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

  getAllFAQS() {
    this.ApiService.get('Content/faqs/paginated', this.faqSearchCreteria).subscribe((res: any) => {
      if (res) {
        this.faqsList = res.data.items;
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
      pageNumber: 1,
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      enTitle: "",
      arTitle: ""
    }
    this.getAllFAQS();
    this.showFilter = false
  }
}
