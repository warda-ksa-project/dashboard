import { Component, inject, signal } from '@angular/core';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Select } from 'primeng/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { IDialog } from '../../../components/modal/modal.interface';
import { ModalComponent } from '../../../components/modal/modal.component';
import { ToasterService } from '../../../services/toaster.service';
import { GalleryComponent } from '../../../components/gallery/gallery.component';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';
import { environment } from '../../../../environments/environment';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { TableModule } from 'primeng/table';
import { Roles } from '../../../conts';

const global_PageName='order.pageName';
const global_routeUrl ='orders'
const global_API_details='order'+'/GetById?Id=';
const global_API_create='order'+'/Create';
const global_API_update='order'+'/Update';

@Component({
  selector: 'app-orders-details',
  standalone: true,
  imports: [BreadcrumpComponent,InputTextComponent,TableModule,DialogComponent,ReactiveFormsModule, TranslatePipe, TextareaModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './orders-details.component.html',
  styleUrl: './orders-details.component.scss'
})
export class OrdersDetailsComponent {

pageName =signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  data:any={}
  form = new FormGroup({
    customerName: new FormControl(''),
    traderName: new FormControl(''),
    phoneNumber: new FormControl(''),
    address: new FormControl(''),
    status:new FormControl(''),
    paymentWay: new FormControl(''),
    id:new FormControl(this.getID|0)
  })

  bredCrumb: IBreadcrumb = {
    crumbs: [ ]
  }

  // editImageProps: IEditImage = {
  //   props: {
  //     visible: true,
  //     imgSrc: ''
  //   },
  //   onEditBtn: (e?: Event) => {
  //     this.editImageProps.props.visible = false;
  //     this.editMode = false;
  //   }
  // };

  // editMode: boolean = false;
  role=''
  get getID() {
    return this.route.snapshot.params['id']
  }

    selectedLang: any;
    languageService = inject(LanguageService);

  ngOnInit() {

    this.pageName.set(global_PageName)
    this.getBreadCrumb();
    this.getRoles();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
      this.getRoles();
    });
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()
  }

  tyepMode() {
    const url = this.router.url;
    let result='Add'
    if (url.includes('edit')) result='Edit'
    else if (url.includes('view')) result= 'View'
    else result= 'Add'
    return result
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label:  this.languageService.translate('Home'),
          routerLink:  this.role==Roles.admin?'/dashboard-admin':'/dashboard-trader',
        },
        {
          label: this.languageService.translate(this.pageName()+ '_'+this.tyepMode()+'_crumb'),
        },
      ]
    }
  }


  API_getItemDetails() {
    this.ApiService.get(`${global_API_details}${this.getID}`).subscribe((res: any) => {
      if (res.data){
        this.data=res.data
        this.form.patchValue({
          ...res.data,
          address:res.data.address.expalinedAddress,
          status:this.selectedLang=='en'?res.data.statusEn:res.data.statusAr
        });
        this.data.products=res.data.orderItemResponseDtos
      }
      // this.editImageProps.props.imgSrc = this.imageUrl + '/' + res.image;
      // console.log(this.editImageProps);
      // this.editMode = true;


    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
    }
    if (this.tyepMode() == 'Add')
      this.API_forAddItem(payload)
    else
      this.API_forEditItem(payload)
  }

  navigateToPageTable(){
    this.router.navigateByUrl(global_routeUrl)
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue && this.tyepMode()=='Edit')
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.navigateToPageTable()

  }

  onConfirmMessage() {
    this.navigateToPageTable()

  }


  API_forAddItem(payload: any) {
    this.ApiService.post(global_API_create, payload).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }

  getRoles(){
    this.ApiService.get('Auth/getRoles').subscribe((res:any)=>{
      this.role=res.data
    })
  }
  API_forEditItem(payload: any) {
    this.ApiService.put(global_API_update, payload).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }


}



//   pageName = signal<string>('');
//   private ApiService = inject(ApiService);
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);
//   private tosater = inject(ToasterService);
//   translateService = inject(TranslateService)


//   showConfirmMessage: boolean = false;
//   clientDetails: any;

//   bredCrumb: IBreadcrumb = {
//     crumbs: [
//       // { label: 'Home', routerLink: '/dashboard' },
//       // { label: 'Order' },
//     ]
//   };

//   dialogProps: IDialog = {
//     props: { visible: false },
//     onHide: () => { },
//     onShow: () => { }
//   };

//   driverDialogProps: IDialog = {
//     props: { visible: false },
//     onHide: () => { },
//     onShow: () => { }
//   };

//   additinalModal: IDialog = {
//     props: { visible: false },
//     onHide: () => { },
//     onShow: () => { }
//   };

//   deleteModal: IDialog = {
//     props: { visible: false },
//     onHide: () => { },
//     onShow: () => { }
//   };

//   statuses: any[] = [];

//   orderStatusValue: any;
//   orderDetails: any;
//   orderTechnicalAssignments: any;
//   providerList: any;
//   providerValue: any;
//   providerCase = 'new'

//   providerObject = {
//     orderTechnicalAssignmentId: 0,
//     orderId: 0,
//     technicalId: 0
//   };

//   additionalObject = {
//     "orderId": 0,
//     "orderAddtionalItemId": 0,
//     "additionalPrice": 0,
//     "note": ""
//   }

//   imageList: any;

//   additonalItemList: any;
//   additonalCase = 'new';
//   additonalTitle = 'Add Additonal Item'

//   providerTitle = 'Add New Provider';

//   orderTimeSchedule: any;

//   deleteType: string = '';


//   driversList: any;
//   driverValue: any;
//   driverTitle = 'Add New Driver';
//   selectedLang: any;
//   languageService = inject(LanguageService);

//   deletedProviderId: string = '';
//   checkOrderStatus: any;

//   ngOnInit() {
//     this.statuses = [
//       {
//         name: this.selectedLang === 'ar' ? 'قيد الانتظار' : 'Pending',
//         id: 0,
//         color: '#c1cd6a',
//         nameAr: 'قيد الانتظار',
//         nameEn: 'Pending'
//       },
//       {
//         name: this.selectedLang === 'ar' ? 'مدفوع' : 'Paid',
//         id: 1,
//         color: '#c1cd6a',
//         nameAr: 'مدفوع',
//         nameEn: 'Paid'
//       },
//       {
//         name: this.selectedLang === 'ar' ? 'مخصص للمزود' : 'AssignedToProvider',
//         id: 2,
//         color: '#b16acd',
//         nameAr: 'مخصص للمزود',
//         nameEn: 'AssignedToProvider'
//       },
//       {
//         name: this.selectedLang === 'ar' ? 'في الطريق' : 'InTheWay',
//         id: 3,
//         color: '#ccc053',
//         nameAr: 'في الطريق',
//         nameEn: 'InTheWay'
//       },
//       {
//         name: this.selectedLang === 'ar' ? 'محاولة حل المشكلة' : 'TryingSolveProblem',
//         id: 4,
//         color: '#9b9d9c',
//         nameAr: 'محاولة حل المشكلة',
//         nameEn: 'TryingSolveProblem'
//       },
//       {
//         name: this.selectedLang === 'ar' ? 'محلول' : 'Solved',
//         id: 5,
//         color: '#49e97c',
//         nameAr: 'محلول',
//         nameEn: 'Solved'
//       },
//       {
//         name: this.selectedLang === 'ar' ? 'تأكيد العميل' : 'ClientConfirmation',
//         id: 6,
//         color: '#49e97c',
//         nameAr: 'تأكيد العميل',
//         nameEn: 'ClientConfirmation'
//       },
//       {
//         name: this.selectedLang === 'ar' ? 'مكتمل' : 'Completed',
//         id: 7,
//         color: '#49e97c',
//         nameAr: 'مكتمل',
//         nameEn: 'Completed'
//       },
//       {
//         name: this.selectedLang === 'ar' ? 'ملغي' : 'Canceled',
//         id: 8,
//         color: '#e94949',
//         nameAr: 'ملغي',
//         nameEn: 'Canceled'
//       }
//     ];

//     this.pageName.set('order.pageName');
//     this.getBreadCrumb();
//     this.languageService.translationService.onLangChange.subscribe(() => {
//       this.selectedLang = this.languageService.translationService.currentLang;
//       this.getBreadCrumb();
//       this.statuses = [
//         {
//           name: this.selectedLang === 'ar' ? 'قيد الانتظار' : 'Pending',
//           id: 0,
//           color: '#c1cd6a',
//           nameAr: 'قيد الانتظار',
//           nameEn: 'Pending'
//         },
//         {
//           name: this.selectedLang === 'ar' ? 'مدفوع' : 'Paid',
//           id: 1,
//           color: '#c1cd6a',
//           nameAr: 'مدفوع',
//           nameEn: 'Paid'
//         },
//         {
//           name: this.selectedLang === 'ar' ? 'مخصص للمزود' : 'AssignedToProvider',
//           id: 2,
//           color: '#b16acd',
//           nameAr: 'مخصص للمزود',
//           nameEn: 'AssignedToProvider'
//         },
//         {
//           name: this.selectedLang === 'ar' ? 'في الطريق' : 'InTheWay',
//           id: 3,
//           color: '#ccc053',
//           nameAr: 'في الطريق',
//           nameEn: 'InTheWay'
//         },
//         {
//           name: this.selectedLang === 'ar' ? 'محاولة حل المشكلة' : 'TryingSolveProblem',
//           id: 4,
//           color: '#9b9d9c',
//           nameAr: 'محاولة حل المشكلة',
//           nameEn: 'TryingSolveProblem'
//         },
//         {
//           name: this.selectedLang === 'ar' ? 'محلول' : 'Solved',
//           id: 5,
//           color: '#49e97c',
//           nameAr: 'محلول',
//           nameEn: 'Solved'
//         },
//         {
//           name: this.selectedLang === 'ar' ? 'تأكيد العميل' : 'ClientConfirmation',
//           id: 6,
//           color: '#49e97c',
//           nameAr: 'تأكيد العميل',
//           nameEn: 'ClientConfirmation'
//         },
//         {
//           name: this.selectedLang === 'ar' ? 'مكتمل' : 'Completed',
//           id: 7,
//           color: '#49e97c',
//           nameAr: 'مكتمل',
//           nameEn: 'Completed'
//         },
//         {
//           name: this.selectedLang === 'ar' ? 'ملغي' : 'Canceled',
//           id: 8,
//           color: '#e94949',
//           nameAr: 'ملغي',
//           nameEn: 'Canceled'
//         }
//       ];
//       if (this.orderStatusValue) {
//         this.orderStatusValue = this.statuses.find(status => status.id === this.orderStatusValue.id);
//       }
//     });
//     this.getOrderDetails();
//     this.getTechnicalList();
//     this.getOrderTimeSchedule();
//     this.getDriversList();
//   }
//   getBreadCrumb() {
//     this.bredCrumb = {
//       crumbs: [
//         {
//           label: this.languageService.translate('Home'),
//           routerLink: '/dashboard',
//         },
//         {
//           label: this.languageService.translate(this.pageName() + '_' + this.tyepMode() + '_crumb'),
//         },
//       ]
//     }
//   }
//   get orderId(): number {
//     const id = this.route.snapshot.params['id'];
//     this.providerObject.orderId = +id;
//     return +id;
//   }

//   tyepMode() {
//     const url = this.router.url;
//     let result = 'Add'
//     if (url.includes('edit')) result = 'Edit'
//     else if (url.includes('view')) result = 'View'
//     else result = 'Add'

//     // this.bredCrumb.crumbs[1].label =this.translateService.instant(this.pageName()+ '_'+result+'_crumb');
//     return result
//   }


//   getOrderDetails() {
//     this.ApiService.get(`Order/Get/${this.orderId}`).subscribe((res: any) => {
//       if (res && res.data) {
//         this.orderDetails = res.data;
//         this.orderTechnicalAssignments = res.data.orderTechnicalAssignments;
//         this.additonalItemList = res.data.orderAddtionalItem;
//         this.imageList = res.data.media;
//         if (this.imageList.length != 0) {
//           this.addUrltoMedia(this.imageList);
//         }
//         this.setOrderStatusById(res.data.orderStatusEnum);
//         this.getClientData(res.data.clientId);
//       }
//     });
//   }


//   addUrltoMedia(list: any) {
//     console.log(this.imageList);
//     list.forEach((data: any) => {
//       data.src = this.imageUrl + data.src;
//     });
//   }

//   getClientData(clientId: string) {
//     this.ApiService.get(`Client/GetById/${clientId}`).subscribe((res: any) => {
//       if (res && res.data) {
//         this.clientDetails = res.data;
//       }
//     });
//   }

//   viewClientDetails(clientId: string) {
//     this.router.navigate(['/client/edit/', clientId]);
//   }

//   dialNumber(phoneNumber: string): void {
//     window.location.href = `tel:${phoneNumber}`;
//   }

//   onStatusChange() {
//     this.ApiService.put(
//       `Order/ChangeStatus?OrderId=${this.orderId}&orderStatusEnum=${this.orderStatusValue.id}`,
//       {}
//     ).subscribe(() => {
//       this.getOrderDetails();
//       this.tosater.successToaster('Order Status Updated Successfully');
//       console.log(this.orderStatusValue);
//       this.checkOrderStatus = this.orderStatusValue.id;
//       console.log(this.checkOrderStatus);
//     });
//   }

//   setOrderStatusById(id: number): void {
//     this.orderStatusValue = this.statuses.find(status => status.id === id);
//     this.checkOrderStatus = this.orderStatusValue.id
//     console.log(this.checkOrderStatus);
//   }

//   getColorById(id: number): string | null {
//     const status = this.statuses.find(s => s.id === id);
//     return status ? status.color : null;
//   }

//   convertDate(originalDate: string): string {
//     const date = new Date(originalDate);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   }

//   openTechnicalModal() {
//     this.providerTitle = 'Add New Provider';
//     this.providerCase = 'new';
//     this.dialogProps.props.visible = true;
//   }

//   // openDriverModal() {
//   //   this.driverTitle = 'Add New Driver';
//   //   this.providerCase = 'new';
//   //   this.driverDialogProps.props.visible = true;
//   // }

//   // getTechnicalList() {
//   //   this.ApiService.get('Technical/GetAllActiveTechnicals').subscribe((res: any) => {
//   //     this.providerList = res.data;
//   //   });
//   // }

//   // getDriversList() {
//   //   this.ApiService.get('Technical/GetAllActiveDrivers').subscribe((res: any) => {
//   //     this.driversList = res.data;
//   //   });
//   // }

//   // addNewTechnical() {
//   //   this.providerObject.orderTechnicalAssignmentId = 0;
//   //   this.ApiService.post('Order/CreateAssignTechnical', this.providerObject).subscribe(() => {
//   //     this.getOrderDetails();
//   //     this.dialogProps.props.visible = false;
//   //     this.driverDialogProps.props.visible = false;
//   //     this.tosater.successToaster('Added Successfully')
//   //   });
//   // }

//   // editTechnical() {
//   //   this.ApiService.put('Order/UpdateAssignTechnical', this.providerObject).subscribe(() => {
//   //     this.getOrderDetails();
//   //     this.dialogProps.props.visible = false;
//   //     this.driverDialogProps.props.visible = false;
//   //     this.tosater.successToaster('Updated Successfully')
//   //   });
//   // }

//   onProviderChange(type: string) {
//     if (type === 't') {
//       this.providerObject.technicalId = this.providerValue.userId;
//       if (this.providerCase == 'new') {
//         this.addNewTechnical();
//       } else {
//         this.editTechnical();
//       }
//     } else {
//       this.providerObject.technicalId = this.driverValue.userId;
//       if (this.providerCase == 'new') {
//         this.addNewTechnical();
//       } else {
//         this.editTechnical();
//       }
//     }
//   }

//   // editProvider(technicalId: number, orderTechnicalAssignmentId: any) {
//   //   this.providerObject.orderTechnicalAssignmentId = orderTechnicalAssignmentId;
//   //   this.dialogProps.props.visible = true;
//   //   this.providerTitle = 'Edit Provider';
//   //   this.providerCase = 'edit';
//   //   this.setTechnicalById(technicalId);
//   // }

//   // setTechnicalById(id: number): void {
//   //   this.providerValue = this.providerList.find((data: any) => data.userId === id);
//   // }

//   editProvider(technicalId: number, orderTechnicalAssignmentId: any, technicalType: number) {
//     this.providerObject.orderTechnicalAssignmentId = orderTechnicalAssignmentId;
//     if (technicalType === 1) {
//       this.dialogProps.props.visible = true;
//       this.providerTitle = 'Edit Provider';
//       this.providerCase = 'edit';
//     } else {
//       this.driverDialogProps.props.visible = true;
//       this.driverTitle = 'Edit Driver';
//       this.providerCase = 'edit';
//     }

//     this.setTechnicalById(technicalId, technicalType);
//   }

//   setTechnicalById(id: number, typeId: number): void {
//     if (typeId === 1) {
//       this.providerValue = this.providerList.find((data: any) => data.userId === id);
//     } else {
//       this.driverValue = this.driversList.find((data: any) => data.userId === id);
//     }
//   }

//   openAdditinaolModal() {
//     this.additinalModal.props.visible = true;
//     this.additonalCase = 'new';
//     this.additonalTitle = 'Add Additonal Item';
//   }

//   addAdditinalItem() {
//     this.ApiService.post('OrderAdditionalItems/Create', this.additionalObject).subscribe((res: any) => {
//       console.log(res);
//       this.getOrderDetails();
//       this.additinalModal.props.visible = false;
//       this.tosater.successToaster('Additinal Item Added Successfully')
//     })
//   }

//   editAdditinalItem() {
//     this.ApiService.put('OrderAdditionalItems/Update', this.additionalObject).subscribe((res: any) => {
//       console.log(res);
//       this.getOrderDetails();
//       this.additinalModal.props.visible = false;
//       this.tosater.successToaster('Additinal Item Updated Successfully')
//     })
//   }

//   editAdditinal(item: any) {
//     this.additionalObject = item;
//     this.additinalModal.props.visible = true;
//     this.additonalCase = 'edit';
//     this.additonalTitle = 'edit Additonal Item';
//   }

//   getOrderTimeSchedule() {
//     this.ApiService.get(`Order/GetOrderSchedule/${this.orderId}`).subscribe((res: any) => {
//       console.log(res.data);
//       this.orderTimeSchedule = res.data;
//     })
//   }

//   formatDateTime(dateString: string): string {
//     const date = new Date(dateString);

//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();

//     const hours = date.getHours();
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const amPm = hours >= 12 ? 'PM' : 'AM';
//     const formattedHours = hours % 12 || 12;

//     return `${day}/${month}/${year} - ${formattedHours}:${minutes} ${amPm}`;
//   }

//   onSubmit(form: any) {
//     this.additionalObject.orderId = this.orderId
//     if (form.valid) {
//       console.log('Form Submitted:', this.additionalObject);

//       if (this.additonalCase == 'new') {
//         this.addAdditinalItem();
//       } else {
//         this.editAdditinalItem();
//       }
//       form.resetForm();
//     } else {
//       console.log('Form is invalid');
//     }
//   }

//   openDeleteModal(actionType: string, item?: any) {
//     this.deleteType = actionType;
//     this.deleteModal.props.visible = true;
//     if (item) {
//       this.deletedProviderId = item.orderTechnicalAssignmentId
//     }
//   }

//   deleteOrder() {
//     this.ApiService.deleteWithoutParam('Order/Deleteorder', this.orderId.toString()).subscribe((res: any) => {
//       this.tosater.successToaster('Order Item Deleted Successfully');
//       this.router.navigate(['/orders']);
//     })
//   }

//   deleteProvider() {
//     this.ApiService.deleteWithoutParam('Order/DeleteAssignTechnical', this.deletedProviderId.toString()).subscribe((res: any) => {
//       this.tosater.successToaster('Provider Deleted Successfully');
//     })
//   }
// }
