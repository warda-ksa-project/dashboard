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
import { userType } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { environment } from '../../../../environments/environment';
import { LanguageService } from '../../../services/language.service';

const global_PageName = 'about_us.pageName';
const global_API_deialis = 'Content/about-us';
const global_API_create = 'Content/about-us';
const global_API_update = 'Content/about-us';
const global_routeUrl = 'about-us'

@Component({
  selector: 'app-about-us-details',
  standalone: true,
  imports: [ReactiveFormsModule,EditModeImageComponent,TranslatePipe,SelectComponent, ButtonModule, NgIf, DialogComponent, TitleCasePipe, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './about-us-details.component.html',
  styleUrl: './about-us-details.component.scss'
})
export class AboutUsDetailsComponent {
  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  userTypeList = userType
  private confirm = inject(ConfirmMsgService)
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

  minEndDate:Date =new Date()
  form = new FormGroup({
    enName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.editorEnglishCharsValidator()
      ],
    }),
    arName: new FormControl <any>('', {
      validators: [
        Validators.required,
        Validations.editorArabicCharsValidator()
      ]
    }),
    userType: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    enDescription: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    arDescription: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    image: new FormControl('',{
      validators: [
        Validators.required,
      ]
    }),
    aboutUsId: new FormControl(this.getID | 0),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: this.pageName(),
      },
    ]
  }

  get getID() {
    return this.route.snapshot.params['id']
  }

  get isRequiredError(): boolean {
    const control = this.form.get('image');
    return control?.touched && control?.hasError('required') || false;
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

  API_getItemDetails() {
    this.ApiService.get(`${global_API_deialis}/${this.getID}`).subscribe((res: any) => {
      const d = res?.data ?? res;
      if (d) {
        this.form.patchValue({
          enName: d.enTitle ?? d.enName,
          arName: d.arTitle ?? d.arName,
          enDescription: d.enContent ?? d.enDescription,
          arDescription: d.arContent ?? d.arDescription,
          userType: d.userType
        });
        this.editImageProps.props.imgSrc = d.image ?? '';
        this.editMode = true;
        // في وضع التعديل الصورة موجودة فعلاً، فلا نجعلها مطلوبة حتى يكون الفورم صالحاً
        this.form.get('image')?.clearValidators();
        this.form.get('image')?.updateValueAndValidity();
      }
    });
  }

  onSubmit() {
    const raw = this.form.value;
    const payload: any = {
      arTitle: raw.arName ?? '',
      enTitle: raw.enName ?? '',
      arContent: raw.arDescription ?? '',
      enContent: raw.enDescription ?? '',
      imageBase64: raw.image || null,
      userType: raw.userType ?? 0
    };
    if (this.tyepMode() === 'Edit') payload.id = Number(this.getID);
    if (this.tyepMode() === 'Add') this.API_forAddItem(payload);
    else this.API_forEditItem(payload);
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
    this.ApiService.post(global_API_create, payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) this.navigateToPageTable();
    });
  }

  API_forEditItem(payload: any) {
    this.ApiService.put(global_API_update, payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) this.navigateToPageTable();
    });
  }


}

