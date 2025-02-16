import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectComponent } from '../../../components/select/select.component';
import { LanguageService } from '../../../services/language.service';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { gender } from '../../../conts';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { UploadFileComponent } from '../../../components/upload-file/upload-file.component';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { environment } from '../../../../environments/environment.prod';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';

const global_PageName = 'profile.pageName';
const global_API_deialis =  'admin/GetById';
const global_API_update =  'admin/Update';
const global_routeUrl = '/profile'
@Component({
  selector: 'app-edit-profile',
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
            EditModeImageComponent,
            UploadFileComponent,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

pageName = signal<string>(global_PageName);

  userDate=JSON.parse(localStorage.getItem('userData')as any);
  defaultImage=this.userDate.gender==1?'assets/images/arabian-man.png':'assets/images/arabian-woman.png'
  userId=this.userDate.id
  imgUrl:any=null
  private ApiService = inject(ApiService)
  private router = inject(Router)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  roleList:any[]=[]
  genderList=gender
  minEndDate:Date =new Date()
  selectedLang: any;
  languageService = inject(LanguageService);
  editMode: boolean = false;
  showUserImage:boolean=true

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
    imgSrc:new FormControl(''),
    isActive: new FormControl<boolean>(true),
    userId: new FormControl( this.userId| 0),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }


  // get isRequiredError(): boolean {
  //   const control = this.form.get('imgSrc');
  //   return control?.touched && control?.hasError('required') || false;
  // }


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
      this.API_getItemDetails()
      this.removePasswordValidation()
  }

  tyepMode() {
    let result = 'Edit'
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
  // onPasswordChanged(value:any){
  //       this.form.get('confirmPassword')?.reset()
  // }
  // onConfirmPasswordChanged(value:string){
  //       const ctrlConfirm =this.form.controls.confirmPassword
  //       ctrlConfirm.setValidators(Validations.confirmValue(this.form.value.password))
  //       ctrlConfirm.updateValueAndValidity()
  // }
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

 
  removePasswordValidation(){
    const ctrlform =this.form.controls

    ctrlform.password.removeValidators(Validators.required)
    ctrlform.confirmPassword.removeValidators(Validators.required)

    ctrlform.password.updateValueAndValidity()
    ctrlform.confirmPassword.updateValueAndValidity()
  }

  API_getItemDetails() {
    this.ApiService.get(`${global_API_deialis}/${this.userId}`).subscribe((res: any) => {
      if (res){
        this.form.patchValue(res.data)
        this.imgUrl=res.data.imgSrc?environment.baseImageUrl+res.data.imgSrc:this.defaultImage
      }
    })
  }

  onSubmit() {   
      delete this.form.value.password
      delete this.form.value.confirmPassword
      this.API_forEditItem(this.form.value)
    
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
// onEditProfile(){
//   this.mode='Edit'
//   this.bredCrumb
//   console.log("ProfileComponent  onEditProfile   this.bredCrumb:",  this.bredCrumb)
// }

  API_forEditItem(payload: any) {
    this.ApiService.put(global_API_update, payload, { showAlert: true, message: `update ${this.pageName()} Successfuly` }).subscribe(res => {
      if (res){
        this.navigateToPageTable()
      }
       

    })
  }


}

