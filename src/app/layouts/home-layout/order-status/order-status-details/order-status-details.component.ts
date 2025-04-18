import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../../validations';
import { InputTextComponent } from '../../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../../components/editor/editor.component';
import { BreadcrumpComponent } from "../../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../../services/confirm-msg.service';
import { DialogComponent } from '../../../../components/dialog/dialog.component';
import { UploadFileComponent } from "../../../../components/upload-file/upload-file.component";
import { userType } from '../../../../conts';
import { SelectComponent } from '../../../../components/select/select.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/language.service';

const global_PageName = 'orderStatus.pageName';
@Component({
  selector: 'app-order-status-details',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe, TranslatePipe, ButtonModule, NgIf, SelectComponent, DialogComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './order-status-details.component.html',
  styleUrl: './order-status-details.component.scss'
})
export class OrderStatusDetailsComponent {
 pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  userTypeList = userType
  selectedLang: any;
  languageService = inject(LanguageService);
  private confirm = inject(ConfirmMsgService)
  form = new FormGroup({
    titleEn: new FormControl('', {
      validators: [
        Validators.required,
      ],
    }),
    titleAr: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    color: new FormControl(''),
    displayOrder: new FormControl(0),
   
  })

 

  get faqsID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.pageName.set(global_PageName)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    });
    if (this.tyepMode() !== 'Add')
      this.getFaqsDetails()
  }

  tyepMode() {
    const url = this.router.url;
    let result = 'Add'
    if (url.includes('edit')) result = 'Edit'
    else if (url.includes('view')) result = 'View'
    else result = 'Add'
    return result
  }
 

  getFaqsDetails() {
    this.ApiService.get(`orderStatus/GetStatusById/`, { id: this.faqsID }).subscribe((res: any) => {
      if (res.data)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
      id: this.faqsID || 0,
    }
    if (this.tyepMode() === 'Add')
      this.addFQS(payload)
    else
      this.editFQS(payload)
  }


  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.router.navigateByUrl('/settings/faqs')

  }

  onConfirmMessage() {
    this.router.navigateByUrl('/orderStatus')

  }

  addFQS(payload: any) {
    this.ApiService.post('orderStatus/Create', payload, { showAlert: true, message: '' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('/orderStatus')
    })
  }

  editFQS(payload: any) {
    this.ApiService.put('orderStatus/Update', payload, { showAlert: true, message: '' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('/orderStatus')
    })
  }


}
