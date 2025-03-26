import { Component, inject, signal } from '@angular/core';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { IDialog } from '../../../components/modal/modal.interface';
import { ModalComponent } from '../../../components/modal/modal.component';
import { ToasterService } from '../../../services/toaster.service';
import { InputNumber } from 'primeng/inputnumber';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { environment } from '../../../../environments/environment';
import { GalleryComponent } from '../../../components/gallery/gallery.component';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';


const global_PageName = 'special_order.pageName';

@Component({
  selector: 'app-special-order-details',
  standalone: true,
  imports: [BreadcrumpComponent, TranslatePipe, TitleCasePipe, TextareaModule, FloatLabel, GalleryComponent, InputNumber, InputIcon, IconField, FormsModule, RouterModule, CommonModule, Select, FormsModule, Tooltip, ModalComponent],
  templateUrl: './special-order-details.component.html',
  styleUrl: './special-order-details.component.scss'
})
export class SpecialOrderDetailsComponent {
  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tosater = inject(ToasterService);
  selectedLang: any;
  languageService = inject(LanguageService);


  showConfirmMessage: boolean = false;
  clientDetails: any;

  bredCrumb: IBreadcrumb = {
    crumbs: [
      { label: 'Home', routerLink: '/dashboard' },
      { label: 'Order' },
    ]
  };


  dialogProps: IDialog = {
    props: { visible: false },
    onHide: () => { },
    onShow: () => { }
  };

  driverDialogProps: IDialog = {
    props: { visible: false },
    onHide: () => { },
    onShow: () => { }
  };


  deleteModal: IDialog = {
    props: { visible: false },
    onHide: () => { },
    onShow: () => { }
  };

  deletedProviderId: string = '';
  deleteType: string = '';



  statuses: any [] = [
  ];


  orderStatusValue: any;
  orderDetails: any;
  orderTechnicalAssignments: any;
  providerList: any;
  providerValue: any;
  providerCase = 'new'

  providerObject = {
    specialOrderTechnicalAssignmentId: 0,
    specialOrderId: 0,
    technicalId: 0
  };

  orderAmount: number = 1;
  imageList: any;


  specialOrderId: any;

  providerTitle = 'Add New Provider';

  orderTimeSchedule: any;
  driversList: any;
  driverValue: any;
  driverTitle = 'Add New Driver';
  checkOrderStatus: any;

  ngOnInit() {
    this.statuses = [
      { name: this.selectedLang == 'ar' ? 'قيد الانتظار' : 'Pending', id: 1, color: '#c1cd6a', nameAr: 'قيد الانتظار', nameEn: 'Pending' },
      { name: this.selectedLang == 'ar' ? 'مكتمل' : 'Completed', id: 2, color: '#3fac4e', nameAr: 'مكتمل', nameEn: 'Completed' },
      { name: this.selectedLang == 'ar' ? 'ملغي' : 'Canceled', id: 3, color: '#c32722', nameAr: 'ملغي', nameEn: 'Canceled' }
    ];
    this.pageName.set(global_PageName)
    this.getBreadCrumb()
    this.getSpecialOrderDetails();
    this.getTechnicalList();
    this.getDriversList();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
      this.statuses = [
        { name: this.selectedLang == 'ar' ? 'قيد الانتظار' : 'Pending', id: 1, color: '#c1cd6a', nameAr: 'قيد الانتظار', nameEn: 'Pending' },
        { name: this.selectedLang == 'ar' ? 'مكتمل' : 'Completed', id: 2, color: '#3fac4e', nameAr: 'مكتمل', nameEn: 'Completed' },
        { name: this.selectedLang == 'ar' ? 'ملغي' : 'Canceled', id: 3, color: '#c32722', nameAr: 'ملغي', nameEn: 'Canceled' }
      ];

      if (this.orderStatusValue) {
        this.orderStatusValue = this.statuses.find(status => status.id === this.orderStatusValue.id);
      }
    });
  }

  get orderId(): number {
    const id = this.route.snapshot.params['id'];
    this.specialOrderId = this.route.snapshot.params['id'];
    this.providerObject.specialOrderId = +id;
    return +id;
  }

  tyepMode() {
    const url = this.router.url;
    let result = 'Add'
    if (url.includes('edit')) result = 'Edit'
    else if (url.includes('view')) result = 'View'
    else result = 'Add'
    return result
  }


  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(this.pageName() + '_' + this.tyepMode() + '_crumb'),
        },
      ]
    }
  }

  getSpecialOrderDetails() {
    this.ApiService.get(`SpecialOrder/Get/${this.orderId}`).subscribe((res: any) => {
      if (res && res.data) {
        this.orderDetails = res.data;
        this.orderAmount = res.data.amount;
        this.imageList = res.data.media;
        this.orderTechnicalAssignments = res.data.specialOrderAssigment;

        if (this.imageList.length != 0) {
          this.addUrltoMedia(this.imageList);
        }
        this.setOrderStatusById(res.data.specialOrderStatus);
        this.getClientData(res.data.clientId);
      }
    });
  }

  addUrltoMedia(list: any) {
    console.log(this.imageList);
    list.forEach((data: any) => {
      data.src = data.src;
    });
  }

  getClientData(clientId: string) {
    this.ApiService.get(`Client/GetById/${clientId}`).subscribe((res: any) => {
      if (res && res.data) {
        this.clientDetails = res.data;
      }
    });
  }

  viewClientDetails(clientId: string) {
    this.router.navigate(['/client/edit/', clientId]);
  }

  dialNumber(phoneNumber: string): void {
    window.location.href = `tel:${phoneNumber}`;
  }

  onStatusChange() {
    this.ApiService.put(
      `SpecialOrder/ChangeStatus?SpecialOrderId=${this.orderId}&SpecialOrderStatus=${this.orderStatusValue.id}`,
      {}
    ).subscribe(() => {
      this.getSpecialOrderDetails();
      this.checkOrderStatus = this.orderStatusValue.id;
      this.tosater.successToaster('Order Status Updated Successfully')
    });
  }

  setOrderStatusById(id: number): void {
    this.orderStatusValue = this.statuses.find(status => status.id === id);
    this.checkOrderStatus = this.orderStatusValue.id;
  }

  getColorById(id: number): string | null {
    const status = this.statuses.find(s => s.id === id);
    return status ? status.color : null;
  }

  convertDate(originalDate: string): string {
    const date = new Date(originalDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  openTechnicalModal() {
    this.providerTitle = 'Add New Provider';
    this.providerCase = 'new';
    this.dialogProps.props.visible = true;
  }

  openDriverModal() {
    this.driverTitle = 'Add New Driver';
    this.providerCase = 'new';
    this.driverDialogProps.props.visible = true;
  }

  getTechnicalList() {
    this.ApiService.get('Technical/GetAllActiveTechnicals').subscribe((res: any) => {
      this.providerList = res.data;
    });
  }

  getDriversList() {
    this.ApiService.get('Technical/GetAllActiveDrivers').subscribe((res: any) => {
      this.driversList = res.data;
    });
  }

  addNewTechnical() {
    this.providerObject.specialOrderTechnicalAssignmentId = 0;
    this.ApiService.post('SpecialOrder/CreateAssignTechnical', this.providerObject).subscribe(() => {
      this.getSpecialOrderDetails();
      this.dialogProps.props.visible = false;
      this.driverDialogProps.props.visible = false;
      this.tosater.successToaster('Added Successfully')
    });
  }

  editTechnical() {
    this.ApiService.put('SpecialOrder/UpdateAssignTechnical', this.providerObject).subscribe(() => {
      this.getSpecialOrderDetails();
      this.dialogProps.props.visible = false;
      this.driverDialogProps.props.visible = false;
      this.tosater.successToaster('Updated Successfully')
    });
  }

  onProviderChange(type: string) {
    if (type === 't') {
      this.providerObject.technicalId = this.providerValue.userId;
      if (this.providerCase == 'new') {
        this.addNewTechnical();
      } else {
        this.editTechnical();
      }
    } else {
      this.providerObject.technicalId = this.driverValue.userId;
      if (this.providerCase == 'new') {
        this.addNewTechnical();
      } else {
        this.editTechnical();
      }
    }
  }

  editProvider(technicalId: number, specialOrderTechnicalAssignmentId: any, technicalType: number) {
    this.providerObject.specialOrderTechnicalAssignmentId = specialOrderTechnicalAssignmentId;
    if (technicalType === 1) {
      this.dialogProps.props.visible = true;
      this.providerTitle = 'Edit Provider';
      this.providerCase = 'edit';
    } else {
      this.driverDialogProps.props.visible = true;
      this.driverTitle = 'Edit Driver';
      this.providerCase = 'edit';
    }

    this.setTechnicalById(technicalId, technicalType);
  }

  setTechnicalById(id: number, typeId: number): void {
    if (typeId === 1) {
      this.providerValue = this.providerList.find((data: any) => data.userId === id);
    } else {
      this.driverValue = this.driversList.find((data: any) => data.userId === id);
    }
  }

  getStatus(statusId: number) {
    if (statusId == 1) {
      return 'Pending'
    } else if (statusId == 2) {
      return 'Completed'
    } else {
      return 'Canceled'
    }
  }


  changeAmount() {
    if (this.orderAmount == null || this.orderAmount == undefined) {
      this.tosater.errorToaster('You have to add amount');
    } else {
      this.orderDetails.amount = this.orderAmount;
      this.ApiService.put(
        `SpecialOrder/Update`,
        this.orderDetails
      ).subscribe(() => {
        this.getSpecialOrderDetails();
        this.tosater.successToaster('Order Amount Updated Successfully')
      });
    }
  }

  openDeleteModal(actionType: string, item?: any) {
    this.deleteType = actionType;
    this.deleteModal.props.visible = true;
    if (item) {
      this.deletedProviderId = item.specialOrderTechnicalAssignmentId
    }
  }

  deleteOrder() {
    this.ApiService.deleteWithoutParam('SpecialOrder/Deleteorder', this.specialOrderId.toString()).subscribe((res: any) => {
      this.tosater.successToaster('Order Item Deleted Successfully');
      this.router.navigate(['/special-order']);
    })
  }

  deleteProvider() {
    this.ApiService.deleteWithoutParam('SpecialOrder/DeleteAssignTechnical', this.deletedProviderId.toString()).subscribe((res: any) => {
      this.tosater.successToaster('Provider Deleted Successfully');
    })
  }

}

