import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DialogComponent } from '../dialog/dialog.component';
import { CheckBoxComponent } from '../check-box/check-box.component';
import { environment } from '../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';
import { ToasterService } from '../../services/toaster.service';
import { LanguageService } from '../../services/language.service';

export interface IToggleOptions {
  autoCall: boolean,
  apiName: string
}

export enum EAction {
  delete = "delete",
  view = "view",
  edit = "edit",
  block = "block",
  active = "active"
}

export interface ITableAction {
  name: EAction,
  apiName_or_route: string,
  autoCall: boolean
}

export enum EType {
  id = "id",
  text = "text",
  image = "image",
  object = "object",
  date = "date",
  time = "time",
  status = "status",
  index = "index",
  actions = "actions",
  editor = 'editor',
  boolean = 'boolean',
  toggle = 'toggle',
  orderStatus = 'orderStatus',
  specialOrderStatus = 'specialOrderStatus',
  changeOrderStatus = 'changeOrderStatus'
}

interface INested {
  img: string,
  text: string
}

export interface IcolHeader {
  header: string,
  keyName: string,
  type: EType,
  nested?: INested,
  actions?: any[],
  show?: boolean,
  toggleOptions?: IToggleOptions
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, NgFor, NgIf, TranslatePipe, TooltipModule, DialogComponent, CheckBoxComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, OnChanges {

  @Input() showrecordIndex = false;
  @Input({ required: true }) records: any = [];
  @Input() hasPaginator: boolean = true;
  filterdRecords: any = [];
  @Input({ required: true }) colsHeader: IcolHeader[] = [];
  @Input() actions: any[] = [];
  @Output() onActionCliked = new EventEmitter();
  @Output() onstatusChanged = new EventEmitter();
  @Output() reloadGetAllApi = new EventEmitter();

  showConfirmMessage: boolean = false;
  showBlockConfirmationMessage: boolean = false;
  showActiveConfirmationMessage: boolean = false;

  ApiService = inject(ApiService);
  router = inject(Router);
  toaster = inject(ToasterService);

  selectedLang: any;

  // Inject LanguageService to access the current language.
  private languageService = inject(LanguageService);

  eventEmitValue: any = { action: {}, record: {} }
  imageBaseUrl = environment.baseImageUrl;

  ngOnInit() {
    this.filterdRecords = this.records;
    console.log("TableComponent  ngOnInit  this.filterdRecords:", this.filterdRecords)
    this.selectedLang = this.languageService.translationService.currentLang;

  }

  ngOnChanges() {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.filterdRecords = this.records;
  }

  onAction(action: ITableAction, item: any) {
    this.eventEmitValue.action = action;
    this.eventEmitValue.record = item;

    this.onActionCliked.emit(this.eventEmitValue);
    this.autoCallActions(action, item);
  }

  getNameOfIDHeader() {
    let idName = this.colsHeader.filter(item => item.type == EType.id);
    return idName[0].keyName;
  }

  autoCallActions(action: ITableAction, record: any) {
    let recordId = record[this.getNameOfIDHeader()];
    if (action.name == EAction.delete && action.autoCall) {
      this.showConfirmMessage = !this.showConfirmMessage;
    } else if ((action.name == EAction.edit || action.name == EAction.view) && action.autoCall) {
      this.router.navigateByUrl(action.apiName_or_route + '/' + recordId);
    } else if (action.name == EAction.block && action.autoCall) {
      this.showBlockConfirmationMessage = !this.showBlockConfirmationMessage;
    } else if (action.name == EAction.active && action.autoCall) {
      this.showActiveConfirmationMessage = !this.showActiveConfirmationMessage;
    }
  }

  onConfirmMessage() {
    let action = this.eventEmitValue.action;
    let recordId = this.eventEmitValue.record[this.getNameOfIDHeader()];
    this.showConfirmMessage = false;
    this.showBlockConfirmationMessage = false;
    this.callDeleteAction(action, recordId);
  }

  callDeleteAction(action: ITableAction, id: any) {
    this.ApiService.delete(action.apiName_or_route, id).subscribe(res => {
      if (res) {
        this.filterdRecords = this.filterdRecords.filter((item: any) => item[this.getNameOfIDHeader()] != id)
        this.reloadGetAllApi.emit(true);
      }
    }, err => {
      this.toaster.errorToaster(err.error.message)
    })
  }

  onActiveConfirmMessage() {
    let action = this.eventEmitValue.action;
    let recordId = this.eventEmitValue.record[this.getNameOfIDHeader()];
    this.showActiveConfirmationMessage = false;
    this.callActiveApi(action, recordId);
  }

  callActiveApi(action: ITableAction, id: any) {
    this.ApiService.putWithId(action.apiName_or_route, id).subscribe(res => {
      if (res) {
        this.reloadGetAllApi.emit(true);
      }
    }, err => {
      this.toaster.errorToaster(err.error.message)
    })
  }

  convertDate(originalDate: string) {
    const date = new Date(originalDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  getCurrentTime(originalDate: string): string {
    const now = new Date(originalDate);
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const isAM = hours < 12;
    hours = hours % 12 || 12;
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${isAM ? 'AM' : 'PM'}`;
  }

  onToggleChange(checked: boolean, record: any, col: any) {
    if (col.toggleOptions.autoCall) {
      this.api_update(checked, record, col)
    } else {
      this.onstatusChanged.emit({
        status: checked,
        record: record,
        col: col
      })
    }
  }

  api_update(checkedValue: boolean, record: any, col: any) {
    let payload = record;
    payload[col.keyName] = checkedValue;

    this.ApiService.put(col.toggleOptions.apiName, payload).subscribe(res => {
      if (res) {
        // Optionally add any success handling here
      }
    }, err => {
      this.toaster.errorToaster(err.error.message)
    })
  }

  onStatusChange(orderId: any) {
    this.ApiService.put(
      `Order/ChangeStatus?OrderId=${orderId}&orderStatusEnum=1`,
      {}
    ).subscribe(() => {
      this.reloadGetAllApi.emit(true);
    });
  }

  // Updated: Order Status array with dynamic language fields.
  getOrderStatusColorById(id: number): string | null {
    const statuses = [
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'قيد الانتظار' : 'Pending',
        id: 0,
        color: '#c1cd6a',
        nameAr: 'قيد الانتظار',
        nameEn: 'Pending'
      },
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'مدفوع' : 'Paid',
        id: 1,
        color: '#c1cd6a',
        nameAr: 'مدفوع',
        nameEn: 'Paid'
      },
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'مخصص للمزود' : 'AssignedToProvider',
        id: 2,
        color: '#b16acd',
        nameAr: 'مخصص للمزود',
        nameEn: 'AssignedToProvider'
      },
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'في الطريق' : 'InTheWay',
        id: 3,
        color: '#ccc053',
        nameAr: 'في الطريق',
        nameEn: 'InTheWay'
      },
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'محاولة حل المشكلة' : 'TryingSolveProblem',
        id: 4,
        color: '#9b9d9c',
        nameAr: 'محاولة حل المشكلة',
        nameEn: 'TryingSolveProblem'
      },
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'محلول' : 'Solved',
        id: 5,
        color: '#49e97c',
        nameAr: 'محلول',
        nameEn: 'Solved'
      },
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'تأكيد العميل' : 'ClientConfirmation',
        id: 6,
        color: '#49e97c',
        nameAr: 'تأكيد العميل',
        nameEn: 'ClientConfirmation'
      },
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'مكتمل' : 'Completed',
        id: 7,
        color: '#49e97c',
        nameAr: 'مكتمل',
        nameEn: 'Completed'
      },
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'ملغي' : 'Canceled',
        id: 8,
        color: '#e94949',
        nameAr: 'ملغي',
        nameEn: 'Canceled'
      }
    ];

    const status = statuses.find(status => status.id === id);
    return status ? status.color : null;
  }

  // Updated: Special Order Status array with dynamic language fields.
  getSpecialOrderStatusColorById(id: number): string | null {
    const statuses = [
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'قيد الانتظار' : 'Pending',
        id: 1,
        color: '#c1cd6a',
        nameAr: 'قيد الانتظار',
        nameEn: 'Pending'
      },
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'مكتمل' : 'Completed',
        id: 2,
        color: '#3fac4e',
        nameAr: 'مكتمل',
        nameEn: 'Completed'
      },
      {
        name: this.languageService.translationService.currentLang === 'ar' ? 'ملغي' : 'Canceled',
        id: 3,
        color: '#c32722',
        nameAr: 'ملغي',
        nameEn: 'Canceled'
      }
    ];

    const status = statuses.find(status => status.id === id);
    return status ? status.color : null;
  }
}
