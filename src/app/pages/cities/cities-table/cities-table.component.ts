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
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';

const global_toggleOptions:IToggleOptions={
  apiName:'city/Update',
  autoCall:true,
  }
@Component({
  selector: 'app-cities-table',
  standalone: true,
  imports: [TableComponent, PaginationComponent,TranslatePipe,TitleCasePipe, FormsModule, DrawerComponent, BreadcrumpComponent, RouterModule, InputTextModule, TableSmallScreenComponent],
  templateUrl: './cities-table.component.html',
  styleUrl: './cities-table.component.scss'
})
export class CitiesTableComponent {
  pageName =signal<string>('');
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'City/Delete?requestId',
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
  private router = inject(Router)


  bredCrumb: IBreadcrumb = {
    crumbs: [
    ]
  }

  showFilter: boolean = false

  searchValue: any = '';
  filteredData: any;
  citiesList: any = []
  columns: IcolHeader[] = [];

  columnsSmallTable: IcolHeaderSmallTable[] = []
  totalCount: number = 0;
   citySearch={
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    enName: "",
    arName: "",
    postalCode: ""
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
      { keyName: 'postalCode', header: this.languageService.translate('city.form.postalCode'), type: EType.text, show: true },
      { keyName: 'latitude', header: this.languageService.translate('city.form.latitude'), type: EType.text, show: true },
      { keyName: 'longitude', header: this.languageService.translate('city.form.longitude'), type: EType.text, show: true },
      { keyName: 'shortCut', header: this.languageService.translate('city.form.shortName'), type: EType.text, show: true },
      { keyName: 'status', header: this.languageService.translate('city.form.status'), type: EType.toggle, toggleOptions: global_toggleOptions, show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true }
    ];

    this.columnsSmallTable = [
      { keyName: 'enName', header: this.languageService.translate('city.form.name_en'), type: EType.text, showAs: ETableShow.header },
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'postalCode', header: this.languageService.translate('city.form.postalCode'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'latitude', header: this.languageService.translate('city.form.latitude'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'longitude', header: this.languageService.translate('city.form.longitude'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'shortCut', header: this.languageService.translate('city.form.shortName'), type: EType.text, showAs: ETableShow.content }
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
  console.log('ggg',this.citySearch)
    // this.ApiService.post('City/GetAllWithPagination',this.citySearch).subscribe((res: any) => {
    //   if (res.data) {
    //     this.citiesList = res.data.dataList;
    //     this.totalCount = res.data.totalCount;
    //     this.filteredData = [...this.citiesList]; // Initialize filtered data
    //   }
    // })
     this.ApiService.get('City/GetAll').subscribe((res: any) => {
      if (res) {
        this.citiesList = res;
      }
    })
  }

  onPageChange(event: any) {
    console.log(event);
    this.citySearch.pageNumber = event;
    this.getAllCities();
  }

  openFilter() {
    this.showFilter = true
  }

  onCloseFilter(event: any) {
    this.showFilter = false
  }

  onSubmitFilter() {
    this.getAllCities();
  }


  reset() {
    this.citySearch = {
      pageNumber: 0,
      pageSize: 8,
      sortingExpression: "",
      sortingDirection: 0,
      enName: "",
      arName: "",
      postalCode: ""
    }
    this.getAllCities();
    this.showFilter = false
  }
}
