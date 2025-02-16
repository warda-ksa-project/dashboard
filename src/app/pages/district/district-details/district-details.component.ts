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
import { SelectComponent } from '../../../components/select/select.component';
import { LanguageService } from '../../../services/language.service';

const global_PageName = 'district.pageName';
const global_API_deialis =  'district/GetById';
const global_API_create =  'district/Create';
const global_API_update =  'district/Update';
const global_routeUrl = 'settings/district'

@Component({
  selector: 'app-district-details',
  standalone: true,
  imports: [ReactiveFormsModule,TranslatePipe,SelectComponent, ButtonModule, NgIf, DialogComponent, TitleCasePipe, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './district-details.component.html',
  styleUrl: './district-details.component.scss'
})
export class DistrictDetailsComponent {
pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  citiesList:any[]=[]
  minEndDate:Date =new Date()
   selectedLang: any;
    languageService = inject(LanguageService);

  form = new FormGroup({
    enName: new FormControl('', {
      validators: [
        Validators.required,
      ],
    }),
    arName: new FormControl <any>('', {
      validators: [
        Validators.required,
      ]
    }),
    cityId: new FormControl <any>('', {
      validators: [
        Validators.required,
      ]
    }),
    enDescription: new FormControl<any>('', {
      validators: [
        Validators.required
      ]
    }),
    arDescription: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    districtId: new FormControl(this.getID | 0),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  get getID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.pageName.set(global_PageName)
    this.getAllCities()
    this.getBreadCrumb()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getAllCities()
      this.getBreadCrumb()
    })
   
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()

  }
 
  getAllCities(){
    this.ApiService.get('city/GetAll').subscribe((res:any)=>{
       if(res.data){
          res.data.map((item:any) => {
             this.citiesList.push({
              name:this.selectedLang=='ar'?item.arName :item.enName,
              code:item.cityId
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

