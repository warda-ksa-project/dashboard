import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { EAction, EType, IcolHeader, ITableAction, TableComponent } from '../../../components/table/table.component';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { ETableShow, IcolHeaderSmallTable, TableSmallScreenComponent } from '../../../components/table-small-screen/table-small-screen.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { order_status, Roles } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { UploadFileComponent } from '../../../components/upload-file/upload-file.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ListPageShellComponent } from '../../../components/list-page-shell/list-page-shell.component';
import { SignalRService } from '../../../services/signalr.service';
import { Subscription } from 'rxjs';

const global_pageName = 'order.pageName'
const global_router_edit_url = '/order/edit'
const global_router_view_url = '/order/view'
const global_API_getAll = 'Orders'

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [TableComponent, SelectComponent, UploadFileComponent, DialogModule, TranslatePipe, ReactiveFormsModule, PaginationComponent, FormsModule, TableSmallScreenComponent, ListPageShellComponent],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent implements OnInit, OnDestroy {

  pageName = signal<string>(global_pageName);
  router=inject(Router)
  // orderStatus = order_status
  orderStatusList:any=[]
  clientList: any[] = []
  packageList: any[] = []
  openEditDialog:boolean=false
  tableActions: ITableAction[] = [
    {
      name: EAction.delete,
      apiName_or_route: 'Orders',
      autoCall: true
    },
    {
      name: EAction.edit,
      apiName_or_route: global_router_edit_url,
      autoCall: false
    },
    {
      name: EAction.view,
      apiName_or_route:  global_router_view_url,
      autoCall: true
    },
  ]
  private ApiService = inject(ApiService)
 form = new FormGroup({
  orderId: new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    orderStatusId: new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    statusImage: new FormControl<string | null>(null),
  })


  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  objectSearch = {
    "pageNumber": 1,
    "pageSize": 8,
    "sortingExpression": "",
    "sortingDirection": 1,
  }

  totalCount: number = 0;

  searchValue: any = '';
  filteredData: any;
  dataList: any = []
  columns: IcolHeader[] = [];
  maxDate = new Date();
  role=''

  columnsSmallTable: IcolHeaderSmallTable[] = []

  selectedLang: any;
  languageService = inject(LanguageService);
  private signalR = inject(SignalRService);
  private signalRSub?: Subscription;

  ngOnInit() {
    this.pageName.set(global_pageName)
    this.API_getAll();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayTableCols(this.selectedLang);
    this.getBreadCrumb();
    this.API_getStatus()
    this.getRoles();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayTableCols(this.selectedLang)
      this.API_getStatus()
      this.getRoles();
      this.getBreadCrumb();
    })
    this.signalRSub = this.signalR.dashboardUpdate$.subscribe((update) => {
      if (this.signalR.isOrderUpdate(update)) {
        this.API_getAll();
      }
    });
  }

  ngOnDestroy(): void {
    this.signalRSub?.unsubscribe();
  }
  getRoles(){
    this.ApiService.get('Auth/roles').subscribe((res:any)=>{
      this.role=res.data
    })
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
      ]
    }
  }


  displayTableCols(currentLang: string) {
    this.columns = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: true },
      { keyName: 'customerName', header: this.languageService.translate('order.form.clientName'), type: EType.text, show: true },
      { keyName: 'traderName', header: this.languageService.translate('order.form.traderName'), type: EType.text, show: true },
      { keyName: 'paymentWay', header: this.languageService.translate('order.form.paymentWay'), type: EType.text, show: true },
      { keyName: currentLang === 'ar' ? 'deliveryTypeAr' : 'deliveryTypeEn', header: this.languageService.translate('order.form.deliveryType'), type: EType.text, show: true },
      { keyName: 'totalPrice', header: this.languageService.translate('order.form.price'), type: EType.text, show: true },
      { keyName: 'addedDate', header: this.languageService.translate('order.form.date'), type: EType.date, show: true },
      { keyName: currentLang === 'ar' ? 'statusAr' : 'statusEn', header: this.languageService.translate('order.form.status'), type: EType.status,statusId:'statusEn', show: true },
      { keyName: '', header: this.languageService.translate('Action'), type: EType.actions, actions: this.tableActions, show: true },
    ];

    this.columnsSmallTable = [
      { keyName: 'id', header: this.languageService.translate('Id'), type: EType.id, show: false },
      { keyName: 'customerName', header: this.languageService.translate('order.form.clientName'), type: EType.text, showAs: ETableShow.content },
      { keyName: 'totalPrice', header: this.languageService.translate('order.form.price'), type: EType.text, showAs: ETableShow.content }
    ];
  }

  API_getStatus(){
    this.ApiService.get('OrderStatus').subscribe((res: any) => {
      const list = res?.data ?? res;
      if (list) {
        this.orderStatusList = [];
        (Array.isArray(list) ? list : [list]).forEach((item: any) => {
          this.orderStatusList.push({
            name: this.selectedLang === 'ar' ? (item.arName ?? item.titleAr) : (item.enName ?? item.titleEn),
            code: item.id
          });
        });
      }
    })
  }

  onSelectedValue(selectedItem: any, value: string) {
  }

  private static readonly DeliveryTypeLabels: Record<string, { ar: string; en: string }> = {
    'Delivery': { ar: 'توصيل', en: 'Delivery' },
    'StorePickup': { ar: 'استلام', en: 'Store Pickup' },
  };

  API_getAll() {
    this.ApiService.get(global_API_getAll, this.objectSearch).subscribe((res: any) => {
      if (res) {
        const items = res.data.items ?? [];
        const labels = OrdersTableComponent.DeliveryTypeLabels;
        this.dataList = items.map((item: any) => {
          const key = item.deliveryTypeName ?? (item.deliveryType === 2 ? 'StorePickup' : 'Delivery');
          const t = labels[key] ?? { ar: key, en: key };
          return { ...item, deliveryTypeAr: t.ar, deliveryTypeEn: t.en, addedDate: item.createdDate  };
        });
        this.totalCount = res.data.totalCount;

        this.filteredData = [...this.dataList];
        console.log(this.dataList);
      }
    });
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

  onSubmit() {
    this.API_getAll();
  }

  reset() {
    this.objectSearch = {
      "pageNumber": 1,
      "pageSize": 8,
      "sortingExpression": "",
      "sortingDirection": 0,
    }
    this.API_getAll();
  }

  onEditOrder(e: any) {
    const actionName = e?.action?.name;
    if (actionName === 'edit' || actionName === 'updateStatus') {
      const rec = e?.record;
      const orderId = rec?.id ?? rec?.orderId;
      const statusId = rec?.statusId ?? rec?.orderStatusId;
      this.openEditDialog = true;
      this.form.patchValue({
        orderId: orderId ?? '',
        orderStatusId: statusId ?? '',
      });
    }
  }

  onStatusCellClick(record: any) {
    const orderId = record?.id ?? record?.orderId;
    const statusId = record?.statusId ?? record?.orderStatusId;
    this.openEditDialog = true;
    this.form.patchValue({
      orderId: orderId ?? '',
      orderStatusId: statusId ?? '',
    });
  }
  API_Edit() {
    const { orderId, orderStatusId, statusImage } = this.form.value;
    const payload: any = { orderId, newStatusId: orderStatusId };
    if (statusImage) {
      payload.imageBase64 = statusImage;
    }
    this.ApiService.put('Orders/status', payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) {
        this.form.patchValue({ statusImage: null });
        this.API_getAll();
        this.openEditDialog = false;
      }
    });
  }
  reloadGetAllApi(e: any) {
    if (e) {
      this.API_getAll();
    }
  }

}
