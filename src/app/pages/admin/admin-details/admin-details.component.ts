import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectComponent } from '../../../components/select/select.component';
import { LanguageService } from '../../../services/language.service';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { gender } from '../../../conts';
import { Password } from 'primeng/password';

const global_PageName = 'admin.pageName';
const global_API_deialis =  'admin/GetById';
const global_API_create =  'admin/Create';
const global_API_update =  'admin/Update';
const global_routeUrl = 'settings/admin'

@Component({
  selector: 'app-admin-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    SelectComponent, 
    ButtonModule, 
    NgIf, 
    DialogComponent, 
    TitleCasePipe, 
    InputTextComponent, 
    RouterModule, 
    BreadcrumpComponent, 
    CheckBoxComponent,
  ],
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.scss'
})
export class AdminDetailsComponent {
pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  roleList:any[]=[]
  genderList=gender

  minEndDate:Date =new Date()
   selectedLang: any;
    languageService = inject(LanguageService);

  form = new FormGroup({
    firstName: new FormControl('', {
      validators: [
        Validators.required,
      ],
    }),
    lastName: new FormControl <any>('', {
      validators: [
        Validators.required,
      ]
    }),
    email: new FormControl <any>('', {
      validators: [
        Validators.required,
        Validations.emailValidator()
      ]
    }),
    userName: new FormControl<any>('', {
      validators: [
        Validators.required
      ]
    }),
    mobileNumber: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    roleId: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    password: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    confirmPassword: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    genderId: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    imgSrc: new FormControl(null),
    isActive: new FormControl<boolean>(true),
    userId: new FormControl(this.getID | 0),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  get getID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.pageName.set(global_PageName)
    this.getAllRoles()
    this.getBreadCrumb()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getAllRoles()
      this.getBreadCrumb()

    })
   
    if (this.tyepMode() !== 'Add'){
      this.API_getItemDetails()
      this.removePasswordValidation()
    }else{
      console.log('ggg',this.form.value)
    }


  }

  onPasswordChanged(value:any){
        this.form.get('confirmPassword')?.reset()
  }
  onConfirmPasswordChanged(value:string){
        const ctrlConfirm =this.form.controls.confirmPassword
        ctrlConfirm.setValidators(Validations.confirmValue(this.form.value.password))
        ctrlConfirm.updateValueAndValidity()
  }
  getAllRoles(){
    this.ApiService.get('role/GetAll').subscribe((res:any)=>{
       if(res.data){
          res.data.map((item:any) => {
             this.roleList.push({
              name:this.selectedLang=='ar'?item.arName :item.enName,
              code:item.roleId
             })
          })
       }
    })
  }
   
  onStartDateChange(date:Date){
    this.minEndDate=date
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
          label:  this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(this.pageName()+ '_'+this.tyepMode()+'_crumb'),
        },
      ]
    }
  }
  removePasswordValidation(){
    const ctrlform =this.form.controls

    ctrlform.password.removeValidators(Validators.required)
    ctrlform.confirmPassword.removeValidators(Validators.required)

    ctrlform.password.updateValueAndValidity()
    ctrlform.confirmPassword.updateValueAndValidity()
  }

  API_getItemDetails() {
    this.ApiService.get(`${global_API_deialis}/${this.getID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue(res.data)
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value
    }
    if (this.tyepMode() == 'Add')
      this.API_forAddItem(payload)
    else{
      delete this.form.value.password
      delete this.form.value.confirmPassword
      this.API_forEditItem(this.form.value)
    }
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

