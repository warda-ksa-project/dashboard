import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Validations, isChar } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { UploadFileComponent } from '../../../components/upload-file/upload-file.component';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment.prod';
import { LanguageService } from '../../../services/language.service';
@Component({
  selector: 'app-countries-details',
  standalone: true,
  imports: [
    BreadcrumpComponent,
    ReactiveFormsModule,
    ButtonModule,
    NgIf,
    InputTextComponent,
    DialogComponent,
    CheckBoxComponent,
    UploadFileComponent,
    EditModeImageComponent,
    TranslatePipe,
    TitleCasePipe
  ],
  templateUrl: './countries-details.component.html',
  styleUrl: './countries-details.component.scss'
})
export class CountriesDetailsComponent implements OnInit {
  pageName = signal<string>('');
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  translateService=inject(TranslateService)
  editMode: boolean = false;


  form = new FormGroup({
    enName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.englishCharsValidator(),
      ],
    }),
    arName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.arabicCharsValidator()
      ]
    }),
    currency: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyCharacterValidator()
      ]
    }),
    phoneLength: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    phoneCode: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    status: new FormControl(true),
    image: new FormControl(null, {
      validators: [
        Validators.required,
      ]
    })
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  get countryID() {
    return this.route.snapshot.params['id']
  }

  get isRequiredError(): boolean {
    const control = this.form.get('img');
    return control?.touched && control?.hasError('required') || false;
  }
 selectedLang: any;
  languageService = inject(LanguageService);
  ngOnInit() {
    this.pageName.set('country.pageName')
    this.getBreadCrumb()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
     if (this.tyepMode() !== 'Add')
      this.getCountryDetails()
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
  getCountryDetails() {
    this.ApiService.get(`Country/GetById`,{id:this.countryID}).subscribe((res: any) => {
      if (res){
        this.form.patchValue(res)
        this.editImageProps.props.imgSrc = environment.baseImageUrl+res.data.img;
        this.editMode = true;
      }
    })
  }

  onSubmit() {
    console.log('ff', this.form.value)
    const payload = {
      ...this.form.value,
      id: this.countryID,
    }
    if (this.tyepMode() === 'Add')
      this.addCountry(payload)
    else
      this.editCountry(payload)

  }

  addCountry(payload: any) {
    this.ApiService.post('Country/Create', payload, { showAlert: true, message: 'Add country Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('country')
    })
  }
  editCountry(payload: any) {
    this.ApiService.put('Country/Update', payload, { showAlert: true, message: 'update country Successfuly' }).subscribe(res => {
      if (res)
        this.router.navigateByUrl('country')
    })
  }


  cancel() {
    const confirmed = this.confirm.formHasValue(this.form)
    if (confirmed)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.router.navigateByUrl('/country')
  }
  onConfirmMessage() {
    this.router.navigateByUrl('/country')
  }
}
