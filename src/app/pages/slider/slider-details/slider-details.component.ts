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
import { UploadFileComponent } from "../../../components/upload-file/upload-file.component";
import { coponeOfferTypeList, coponeTypeList, sliderViewType } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { environment } from '../../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';

const global_PageName = 'slider.pageName';
const global_API_deialis = 'Slider' + '/GetById?Id=';
const global_API_create = 'Slider' + '/Create';
const global_API_update = 'Slider' + '/Update';
const global_routeUrl = '/slider' 

@Component({
  selector: 'app-slider-details',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, TitleCasePipe, EditModeImageComponent, ButtonModule, NgIf, DialogComponent, SelectComponent, InputTextComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './slider-details.component.html',
  styleUrl: './slider-details.component.scss'
})
export class SliderDetailsComponent {

  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  editAttachmentMode: boolean = false;
  editAttachmentMode_ar: boolean = false;
  private confirm = inject(ConfirmMsgService)
  offerTypeList: any[] = coponeOfferTypeList
  coponeTypeList: any[] = coponeTypeList
  minEndDate: Date = new Date()
  // viewTypeList = sliderViewType
  editImageProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editImageProps.props.visible = false;
      this.editAttachmentMode = false;
    }
  };
  editImageProps_ar: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editImageProps_ar.props.visible = false;
      this.editAttachmentMode_ar = false;
    }
  };
  form = new FormGroup({
    titleEn: new FormControl('', {
      validators: [
        Validators.required,
        Validations.editorEnglishCharsValidator()
      ],
    }),
    titleAr: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.editorArabicCharsValidator()
      ]
    }),
    imageEn: new FormControl<any>('', {
      validators: [

      ]
    }),
    imageAr: new FormControl<any>('', {
      validators: [

      ]
    }),
    displayOrder: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    viewType: new FormControl(3, {
      validators: [
        Validators.required,
      ]
    }),

    id: new FormControl(this.getID | 0),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  selectedLang: any;
  languageService = inject(LanguageService);


  get getID() {
    return this.route.snapshot.params['id']
  }


  get isRequiredError(): boolean {
    const control = this.form.get('imageEn');
    return control?.touched && control?.hasError('required') || false;
  }

  get isRequiredError_ar(): boolean {
    const control = this.form.get('imageAr');
    return control?.touched && control?.hasError('required') || false;
  }

  ngOnInit() {
    this.pageName.set(global_PageName)
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()
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
    this.ApiService.get(`${global_API_deialis}${this.getID}`).subscribe((res: any) => {
      if (res.data) {
        this.form.patchValue(res.data)
        this.editImageProps.props.imgSrc =  res.data.imageEn;
        this.editAttachmentMode = true;

        this.editImageProps_ar.props.imgSrc =  res.data.imageAr;
        this.editAttachmentMode_ar = true;
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

