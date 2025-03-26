import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { UploadFileComponent } from "../../../components/upload-file/upload-file.component";
import { userType } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { CheckBoxComponent } from "../../../components/check-box/check-box.component";
import { DatePickerComponent } from "../../../components/date-picker/date-picker.component";
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { environment } from '../../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { DatePickerModule } from 'primeng/datepicker';
import { Panel } from 'primeng/panel';
import { WalletDialogComponent } from '../../../components/wallet-dialog/wallet-dialog.component';



const global_PageName = 'client.pageName';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, NgFor, WalletDialogComponent, DatePipe, TitleCasePipe, Panel, NgClass, DatePickerModule, EditModeImageComponent, ButtonModule, NgIf, SelectComponent, DialogComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent, CheckBoxComponent, DatePickerComponent],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss'
})
export class ClientDetailsComponent {
  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  userTypeList = userType
  selectedLang: any;
  languageService = inject(LanguageService);
  private confirm = inject(ConfirmMsgService);
  clientOrdersList: any[] = [];
  clientWalletBalance: any;

  form = new FormGroup({
    firstName: new FormControl('', {
      validators: [
        Validators.required
      ],
    }),
    lastName: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    username: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    mobileNumber: new FormControl('', {
      validators: [
        Validators.required,

      ]
    }),
    pinCode: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,

      ]
    }),
    confirmPassword: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    // notes: new FormControl('', {
    //   validators: [
    //     Validators.required,

    //   ]
    // }),
    imgSrc: new FormControl(''),
    gender: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    isActive: new FormControl(false, {
      validators: [
        Validators.required,

      ]
    }),
    dateOfBirth: new FormControl(null, {
      validators: [
        Validators.required,

      ]
    }),
    userId: new FormControl(this.userId | 0)
  })

  gender = [
    { code: 1, name: 'Male' },
    { code: 2, name: 'Fale' }
  ]

  bredCrumb: IBreadcrumb = {
    crumbs: [

    ]
  }

  maxDate = new Date();

  editImageProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editImageProps.props.visible = false;
      this.editMode = false;
    }
  };

  editMode: boolean = false;
  userStatus: boolean = true;
  clientid: any;

  get userId() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.getBreadCrumb()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
    console.log(this.tyepMode());

    if (this.tyepMode() != 'Add') {
      this.clientid = this.route.snapshot.params['id']
      this.getClientsDetails();
      this.getClientOrders();
      this.getClientWalletAmount();
    }
  }

  tyepMode() {
    const url = this.router.url;
    let result = 'Add'
    if (url.includes('edit')) result = 'Edit'
    else if (url.includes('view')) result = 'View'
    else result = 'Add'

    // this.bredCrumb.crumbs[1].label = result + ' ' +this.languageService.translate(this.pageName());
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

  onPasswordChanged(value: any) {
    this.form.get('confirmPassword')?.reset()
  }

  onConfirmPasswordChanged(value: string) {
    const ctrlConfirm = this.form.controls.confirmPassword
    ctrlConfirm.setValidators(Validations.confirmValue(this.form.value.password))
    ctrlConfirm.updateValueAndValidity()
  }

  getClientsDetails() {
    this.ApiService.get(`Client/GetById/${this.userId}`).subscribe((res: any) => {
      if (res && res.data) {
        const clientData = res.data;
        this.userStatus = res.data.isActive;
        // Convert `dateOfBirth` to a Date object if it exists
        if (clientData.dateOfBirth) {
          clientData.dateOfBirth = new Date(clientData.dateOfBirth);
        }
        const password = res.data?.password;
        if (password) {
          this.form.get('confirmPassword')?.setValue(password);
        }
        this.form.patchValue(clientData);
        this.editMode = true;
        this.editImageProps.props.imgSrc =  res.data.imgSrc;
        console.log("ClientDetailsComponent  this.ApiService.get  this.editImageProps.props.imgSrc :", this.editImageProps.props.imgSrc)
        this.removeValidators()
      }
    });
  }

  removeValidators() {
    const ctrlform = this.form.controls
    ctrlform.confirmPassword.removeValidators(Validators.required)
    ctrlform.confirmPassword.updateValueAndValidity()
    ctrlform.password.removeValidators(Validators.required)
    ctrlform.password.updateValueAndValidity()
    ctrlform.pinCode.removeValidators(Validators.required)
    ctrlform.pinCode.updateValueAndValidity()
    delete this.form.value.confirmPassword
    delete this.form.value.password
    delete this.form.value.pinCode
  }

  onSubmit() {
    if (this.tyepMode() === 'Add')
      this.addFQS(this.form.value)
    else {
      this.removeValidators()
      delete this.form.value.confirmPassword
      delete this.form.value.password
      delete this.form.value.pinCode
      this.editFQS(this.form.value)
    }

  }

  // get isRequiredError(): boolean {
  //   const control = this.form.get('imgSrc');
  //   return control?.touched && control?.hasError('required') || false;
  // }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.router.navigateByUrl('/clients')
  }

  onConfirmMessage() {
    this.router.navigateByUrl('/clients')
  }

  addFQS(payload: any) {
    this.ApiService.post('Client/Create', payload, { showAlert: true, message: 'Add Client Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('clients')
    })
  }

  editFQS(payload: any) {
    this.ApiService.put('Client/Update', payload, { showAlert: true, message: 'update Client Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('clients')
    })
  }

  getClientOrders() {
    this.ApiService.get(`Order/GetOrdersByClientIdDashboard/${this.clientid}`).subscribe((res: any) => {
      console.log(res);
      this.clientOrdersList = res.data;
    })
  }

  goOrder(id: any){
    console.log(id);
    this.router.navigate(['/order/edit' , id])
  }

  getClientWalletAmount() {
    this.ApiService.get(`Wallet/GetBalanceClientId/${this.clientid}`).subscribe((data: any) => {
      console.log(data.data.balance);
      this.clientWalletBalance = data.data.balance;
    })
  }

  onAmountAdded(success: boolean) {
    if (success) {
      this.getClientWalletAmount(); // Call a function to refresh data or perform other actions
    }
  }

}

