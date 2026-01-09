import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { UploadFileComponent } from "../../../components/upload-file/upload-file.component";
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { coponeOfferTypeList, coponeTypeList } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';

const global_PageName = 'copone.pageName';
const global_API_deialis = 'copone' + '/GetById';
const global_API_create = 'copone' + '/Create';
const global_API_update = 'copone' + '/Update';
const global_routeUrl = 'copone'

@Component({
  selector: 'app-copone-details',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe, TranslatePipe, ButtonModule, SelectComponent, CheckBoxComponent, NgIf, DialogComponent, DatePickerComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './copone-details.component.html',
  styleUrl: './copone-details.component.scss'
})
export class CoponeDetailsComponent {
  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  offerTypeList: any[] = coponeOfferTypeList
  coponeTypeList: any[] = coponeTypeList
  minEndDate: Date = new Date()
  form = new FormGroup({
    code: new FormControl('', {
      validators: [Validators.required],
    }),
    numberOfUsing: new FormControl<any>('', {
      validators: [Validators.required, Validations.onlyNumberValidator()]
    }),
    maxUsagePerUser: new FormControl<any>('', {
      validators: [Validators.required, Validations.onlyNumberValidator()]
    }),
    maxAmount: new FormControl<any>(0, {
      validators: [Validators.required, Validations.onlyNumberValidator()]
    }),
    offerType: new FormControl<any>('', {
      validators: [Validators.required, Validations.onlyNumberValidator()]
    }),
    amount: new FormControl<any>('', {
      validators: [Validators.required, Validations.onlyNumberValidator()]
    }),
    coponeType: new FormControl<any>('', {
      validators: [Validators.required, Validations.onlyNumberValidator()]
    }),
    startDate: new FormControl(null, {
      validators: [Validators.required]
    }),
    endDate: new FormControl(null, {
      validators: [Validators.required]
    }),
    enDescription: new FormControl('', {
      validators: [Validators.required]
    }),
    arDescription: new FormControl('', {
      validators: [Validators.required]
    }),
    status: new FormControl(false, {}),
    hasMaxAmount: new FormControl(false, {}),
    usedForXTimes: new FormControl(false, {}),
    coponeId: new FormControl(this.getID | 0),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  get getID() {
    return this.route.snapshot.params['id']
  }
  selectedLang: any;
  languageService = inject(LanguageService);

ngOnInit() {
  this.pageName.set(global_PageName);
  this.getBreadCrumb();

  this.languageService.translationService.onLangChange.subscribe(() => {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.getBreadCrumb();
  });

  if (this.tyepMode() !== 'Add') {
    this.API_getItemDetails();
  }

  if (!this.form.get('hasMaxAmount')?.value) {
    this.form.get('maxAmount')?.disable();
    this.form.get('maxAmount')?.clearValidators();
  } else {
    this.form.get('maxAmount')?.enable();
    this.form.get('maxAmount')?.setValidators([Validators.required, Validators.min(1)]);
  }
  this.form.get('maxAmount')?.updateValueAndValidity();

  this.form.get('hasMaxAmount')?.valueChanges.subscribe((value: any) => {
    if (value) {
      this.form.get('maxAmount')?.enable();
      this.form.get('maxAmount')?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      this.form.get('maxAmount')?.disable();
      this.form.get('maxAmount')?.clearValidators();
    }
    this.form.get('maxAmount')?.updateValueAndValidity();
  });
}


  onStartDateChange(date: Date) {
    this.minEndDate = date
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

  API_getItemDetails() {
    this.ApiService.get(`${global_API_deialis}/${this.getID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
      amount: +this.form.value.amount,
      coponeType: +this.form.value.coponeType,
      offerType: +this.form.value.offerType,
      usedNumber: +this.form.value.numberOfUsing
    }
    if (this.tyepMode() == 'Add')
      this.API_forAddItem(payload)
    else
      this.API_forEditItem(payload)
  }

  navigateToPageTable() {
    this.router.navigateByUrl(global_routeUrl)
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue && this.tyepMode() == 'Edit')
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

  API_forEditItem(payload: any) {
    this.ApiService.put(global_API_update, payload).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }


}

