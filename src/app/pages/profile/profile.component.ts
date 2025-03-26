import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, TitleCasePipe } from '@angular/common';
import { Validations } from '../../validations';
import { BreadcrumpComponent } from "../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../services/confirm-msg.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { gender } from '../../conts';
import { IEditImage } from '../../components/edit-mode-image/editImage.interface';
import { environment } from '../../../environments/environment.prod';

const global_PageName = 'profile.pageName';
const global_API_deialis =  'admin/GetById';
const global_routeUrl = '/profile/edit/'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
        TranslatePipe,
        TitleCasePipe, 
        BreadcrumpComponent, 
        NgFor
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

pageName = signal<string>(global_PageName);
userDataInfo:any[]=[]
  userDate=JSON.parse(localStorage.getItem('userData')as any);
  defaultImage=this.userDate.gender==1?'assets/images/arabian-man.png':'assets/images/arabian-woman.png'
  userId=this.userDate.id
  imgUrl:any=null
  private ApiService = inject(ApiService)
  private router = inject(Router)
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
  tyepMode() {
    let result = 'View'
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
    this.ApiService.get(`${global_API_deialis}/${this.userId}`).subscribe((res: any) => {
      if (res){
        this.form.patchValue(res.data)
        this.imgUrl=res.data.imgSrc?res.data.imgSrc:this.defaultImage
        this.userDataInfo=[{
          icon:'pi pi-address-book',
          title:'profile.name',
          value:res.data.fullName
        },
        {
          icon:'pi pi-user',
          title:'profile.gender',
          value:res.data.genderId==1?'Male':'Female'
        },
        {
          icon:'pi pi-at',
          title:'profile.email',
          value:res.data.email
        }
        ,{
          icon:'pi pi-phone',
          title:'profile.mobile',
          value:res.data.mobileNumber
        }
        ,{
          icon:'pi pi-unlock',
          title:'profile.role',
          value:res.data.roleId
        }
        ,{
          icon:'pi  pi-circle-on',
          title:'profile.status',
          value:res.data.isActive?'active':'deactive'
        },
        {
          icon:'pi pi-address-book',
          title:'profile.userName',
          value:res.data.userName
        }
      ]
      }
    })
  }

  // onSubmit() {   
  //     delete this.form.value.password
  //     delete this.form.value.confirmPassword
  //     this.API_forEditItem(this.form.value)
    
  // }

  navigateToPageTable() {
  this.router.navigateByUrl(global_routeUrl)
  }

  // cancel() {
  //   const hasValue = this.confirm.formHasValue(this.form)
  //   if (hasValue && this.tyepMode() == 'Edit')
  //     this.showConfirmMessage = !this.showConfirmMessage
  //   else
  //     this.navigateToPageTable()

  // }

  // onConfirmMessage() {
  //   this.navigateToPageTable()

  // }
onEditProfile(){
  // this.mode='Edit'
  this.router.navigateByUrl(global_routeUrl+this.userDate.id)
}

  // API_forEditItem(payload: any) {
  //   this.ApiService.put(global_API_update, payload, { showAlert: true, message: `update ${this.pageName()} Successfuly` }).subscribe(res => {
  //     if (res){
  //       this.API_getItemDetails()
  //     }
       

  //   })
  // }


}

