import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { TableModule } from 'primeng/table';
import { MapComponent } from '../../../components/map/map.component';
import { Roles } from '../../../conts';

const global_PageName = 'order.pageName';
const global_routeUrl = 'orders';
const global_API_details = 'order' + '/GetById?Id=';

@Component({
  selector: 'app-orders-details',
  standalone: true,
  imports: [TableModule, InputTextComponent, DialogComponent, ReactiveFormsModule, TranslatePipe, RouterModule, CommonModule, FormsModule, MapComponent],
  templateUrl: './orders-details.component.html',
  styleUrl: './orders-details.component.scss'
})
export class OrdersDetailsComponent {

  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  showConfirmMessage: boolean = false;
  private confirm = inject(ConfirmMsgService);
  data: any = {};
  products: any[] = [];
  customerLat: number = 0;
  customerLng: number = 0;

  form = new FormGroup({
    // Order info
    id: new FormControl(this.getID | 0),
    status: new FormControl(''),
    paymentWay: new FormControl(''),
    totalPrice: new FormControl(''),
    addedDate: new FormControl(''),
    // Customer info
    customerName: new FormControl(''),
    phoneNumber: new FormControl(''),
    customerEmail: new FormControl(''),
    address: new FormControl(''),
    // Trader info
    traderName: new FormControl(''),
    traderStoreName: new FormControl(''),
    traderPhone: new FormControl(''),
    traderEmail: new FormControl(''),
  });

  role = '';

  get getID() {
    return this.route.snapshot.params['id'];
  }

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set(global_PageName);
    this.selectedLang = this.languageService.translationService.currentLang;
    this.getRoles();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getRoles();
    });
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails();
  }

  tyepMode() {
    const url = this.router.url;
    let result = 'Add';
    if (url.includes('edit')) result = 'Edit';
    else if (url.includes('view')) result = 'View';
    else result = 'Add';
    return result;
  }

  API_getItemDetails() {
    this.ApiService.get(`${global_API_details}${this.getID}`).subscribe((res: any) => {
      if (res.data) {
        this.data = res.data;
        this.products = res.data.orderItemResponseDtos || [];

        // Set customer location from address
        if (res.data.address) {
          this.customerLat = Number(res.data.address.latitude) || 0;
          this.customerLng = Number(res.data.address.logitude) || 0;
        }

        this.form.patchValue({
          ...res.data,
          address: res.data.address?.expalinedAddress || '-',
          status: this.selectedLang == 'ar' ? res.data.statusAr : res.data.statusEn,
          totalPrice: res.data.totalPrice,
          addedDate: this.convertDate(res.data.addedDate),
        });
      }
    });
  }

  navigateToPageTable() {
    this.router.navigateByUrl(global_routeUrl);
  }

  cancel() {
    this.navigateToPageTable();
  }

  onConfirmMessage() {
    this.navigateToPageTable();
  }

  getRoles() {
    this.ApiService.get('Auth/getRoles').subscribe((res: any) => {
      this.role = res.data;
    });
  }

  convertDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    return `${day}-${month}-${year}  ${formattedHours}:${minutes} ${amPm}`;
  }

  getStatusClass(): string {
    const statusId = this.data?.statusId;
    if (statusId === 7 || statusId === 5 || statusId === 6) return 'status-completed';
    if (statusId === 8) return 'status-canceled';
    return 'status-pending';
  }
}
