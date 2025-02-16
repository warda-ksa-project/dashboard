import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, TitleCasePipe, NgClass, NgFor, DatePipe } from '@angular/common';
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
import { LanguageService } from '../../../services/language.service';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { environment } from '../../../../environments/environment';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Panel } from 'primeng/panel';
import { WalletDialogComponent } from '../../../components/wallet-dialog/wallet-dialog.component';
@Component({
  selector: 'app-technical-details',
  standalone: true,
  imports: [ReactiveFormsModule,
    EditModeImageComponent,
    ButtonModule, NgIf, TranslatePipe, Panel, NgFor, WalletDialogComponent, DatePipe, SelectComponent, NgClass, TitleCasePipe, DialogComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent, CheckBoxComponent, DatePickerComponent],
  templateUrl: './technical-details.component.html',
  styleUrl: './technical-details.component.scss'
})
export class TechnicalDetailsComponent {
  pageName = signal<string>('');
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private translateService = inject(TranslateService)
  languageService = inject(LanguageService);
  selectedLang: any;
  technicalOrdersList: any[] = [];
  clientWalletBalance: any;



  showConfirmMessage: boolean = false
  userTypeList = userType
  private confirm = inject(ConfirmMsgService)
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
    technicalTypeEnum: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    technicalSpecialistId: new FormControl('', {
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

  TechnicalType = [
    { code: 1, name: 'Technical' },
    { code: 2, name: 'Driver' }
  ]

  technicalSpecialist: any;
  userStatus: boolean = true;


  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: 'Technical',
      },
    ]
  }

  maxDate = new Date();
  technicalId: any

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
  specialistOriginal: any;

  get userId() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.pageName.set('tech.pageName')
    this.getTechnicalSpecialist();
    this.getBreadCrumb()
    this.selectedLang = this.languageService.translationService.currentLang;
    if (this.tyepMode() !== 'Add') {
      this.technicalId = this.route.snapshot.params['id'];
      this.getTechnicalsDetails();
      this.getClientWalletAmount();
      this.getClientOrders();
    }

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.getBreadCrumb()
      this.selectedLang = this.languageService.translationService.currentLang;
      this.technicalSpecialist = this.specialistOriginal.map((item: any) => ({
        code: item.technicalSpecialistId,
        name: this.selectedLang === 'ar' ? item.arName : item.enName
      })
      );
    })
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

  tyepMode() {
    const url = this.router.url;
    let result = 'Add'
    if (url.includes('edit')) result = 'Edit'
    else if (url.includes('view')) result = 'View'
    else result = 'Add'
    return result
  }



  getTechnicalsDetails() {
    this.ApiService.get(`Technical/GetById/${this.userId}`).subscribe((res: any) => {
      if (res && res.data) {
        const technicalData = res.data;
        this.userStatus = res.data.isActive;

        // Convert `dateOfBirth` to a Date object if it exists
        if (technicalData.dateOfBirth) {
          technicalData.dateOfBirth = new Date(technicalData.dateOfBirth);
        }

        const password = res.data?.password;
        if (password) {
          this.form.get('confirmPassword')?.setValue(password);
        }

        this.form.patchValue(technicalData);
        this.editMode = true;
        this.editImageProps.props.imgSrc = environment.baseImageUrl + res.data.imgSrc;
        console.log("TechnicalDetailsComponent  this.ApiService.get  this.editImageProps.props.imgSrc:", this.editImageProps.props.imgSrc)
        this.removeValidators()
      }

    })

  }

  removeValidators() {
    const ctrlform = this.form.controls
    ctrlform.confirmPassword.removeValidators(Validators.required)
    ctrlform.confirmPassword.updateValueAndValidity()
    ctrlform.password.removeValidators(Validators.required)
    ctrlform.password.updateValueAndValidity()
    ctrlform.pinCode.removeValidators(Validators.required)
    ctrlform.pinCode.updateValueAndValidity()
  }
  getTechnicalSpecialist() {
    this.ApiService.get(`TechnicalSpecialist/GetAll`).subscribe((res: any) => {
      if (res && res.data) {
        console.log(res);
        this.specialistOriginal = res.data
        this.technicalSpecialist = res.data;

        this.technicalSpecialist = this.specialistOriginal.map((item: any) => ({
          code: item.technicalSpecialistId,
          name: this.selectedLang === 'ar' ? item.arName : item.enName
        }));
      }

    })
  }

  onSubmit() {
    if (this.tyepMode() === 'Add')
      this.addFQS(this.form.value)
    else {
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
      this.router.navigateByUrl('/technicals')

  }

  onConfirmMessage() {
    this.router.navigateByUrl('/technicals')

  }

  addFQS(payload: any) {
    this.ApiService.post('Technical/Create', payload, { showAlert: true, message: 'Add Client Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('technicals')
    })
  }

  editFQS(payload: any) {
    this.ApiService.put('Technical/Update', payload, { showAlert: true, message: 'update Client Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('technicals')
    })
  }


  getClientOrders() {
    this.ApiService.get(`Order/GetOrdersByTechnicalIdDashboard/${this.technicalId}`).subscribe((res: any) => {
      console.log(res);
      this.technicalOrdersList = res.data;
    })
  }

  goOrder(id: any) {
    console.log(id);
    this.router.navigate(['/order/edit', id])
  }

  getClientWalletAmount() {
    this.ApiService.get(`Wallet/GetBalanceClientId/${this.technicalId}`).subscribe((data: any) => {
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


