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
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { environment } from '../../../../environments/environment';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { GalleryComponent } from '../../../components/gallery/gallery.component';

const global_PageName ='users.pageName';
const global_API_Name ='user';
const global_API_details = global_API_Name + '/GetUser';
const global_API_create = global_API_Name + '/createUser';
const global_API_update = global_API_Name + '/updateUser';
const global_routeUrl ="/users"
@Component({
  selector: 'app-users-details',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,TranslatePipe,CheckBoxComponent,TitleCasePipe,DialogComponent, ButtonModule, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './users-details.component.html',
  styleUrl: './users-details.component.scss'
})
export class UsersDetailsComponent {
pageName = signal<string>(global_PageName);

  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  imageList: any;

  form = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required,
      ],
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
      ],
    }),
    phone: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    password: new FormControl('', {

    }),
    role: new FormControl('', {

    }),
    isActive: new FormControl('', {
    }),
    image:new FormControl(''),
    id: new FormControl(this.getID|0, {
    }),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }
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
  get getID() {
    return this.route.snapshot.params['id']
  }
 selectedLang: any;
  languageService = inject(LanguageService);
  ngOnInit() {
    this.pageName.set(global_PageName)
    this.getBreadCrumb()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    }); 
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()
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
          routerLink: '/dashboard-admin',
        },
        {
          label: this.languageService.translate(this.pageName()+ '_'+this.tyepMode()+'_crumb'),
        },
      ]
    }
  }

  API_getItemDetails() {
    this.ApiService.get(`${global_API_details}`,{id:this.getID}).subscribe((res: any) => {
      if (res){
        this.form.patchValue(res.data)
       this.editMode=true
       this.editImageProps.props.imgSrc =res.data.image;
      }
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value
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
    this.ApiService.post(global_API_create, payload, { showAlert: true, message: `Add ${this.pageName()} Successfuly` }).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }

  API_forEditItem(payload: any) {
    this.ApiService.put(global_API_update, payload, { showAlert: true, message: `update ${this.pageName()} Successfuly` }).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }


}


