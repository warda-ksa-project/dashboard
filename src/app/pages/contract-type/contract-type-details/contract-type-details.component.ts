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
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { SelectComponent } from '../../../components/select/select.component';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

const global_PageName = 'contract.pageName';
const global_API_deialis = 'contractType' + '/GetById';
const global_API_create = 'contractType' + '/Create';
const global_API_update = 'contractType' + '/Update';
const global_routeUrl = 'contract-type'
const global_API_getAllServices = 'service/GetAll'
@Component({
  selector: 'app-contract-type-details',
  standalone: true,
  imports: [ReactiveFormsModule,TranslatePipe, TitleCasePipe, ButtonModule, NgIf, DialogComponent, SelectComponent, InputTextComponent, CheckBoxComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './contract-type-details.component.html',
  styleUrl: './contract-type-details.component.scss'
})
export class ContractTypeDetailsComponent {
  pageName = signal<string>(global_PageName);
  servicesList: any = []
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  serviceContractValues:any[]=[]
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
    noOfVisit: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator(),
      ]
    }),
    isActive: new FormControl(false),
    serviceId: new FormControl<any>('',Validators.required),
    serviceContract:new FormControl<any>(''),
    contractTypeId: new FormControl(this.getID | 0, Validators.required),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  selectedLang: any;
  languageService = inject(LanguageService);
  get getID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.pageName.set(global_PageName)
    this.getAllServices()
    this.getBreadCrumb()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      console.log("CityDetailsComponent  this.languageService.translationService.onLangChange.subscribe   this.selectedLang:", this.selectedLang)
      this.getAllServices()
      this.getBreadCrumb()

    })
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
      if (res){
        let serviceContract:number []=[]
        this.form.patchValue(res.data)
        this.form.value.serviceContract.map((item:any)=>{
          serviceContract.push(item.serviceId)
           this.serviceContractValues.push({
            serviceContractId:item.serviceContractId,
            serviceId:item.serviceId
           })
        })
        this.form.patchValue({
          serviceContract: serviceContract,
          serviceId:serviceContract
        })
      }


        
    })
  }

  onSubmit() {
  
    let serviceId:any =[]
    let servicePayload:any=[]
    serviceId=this.form.value.serviceId
    if (this.tyepMode() == 'Add'){
      serviceId.map((item:any)=>{
        servicePayload.push({
          serviceContractId:0,
          contractId:0,
          serviceId:item
        })
      })
      this.form.patchValue({
        serviceContract: servicePayload
      })

      this.API_forAddItem(this.form.value)
    }
     
    else{
      serviceId.map((id:any)=>{
        servicePayload.push({
          serviceContractId:this.serviceContractValues.filter(item => item.serviceId === id)[0]?.serviceContractId ? this.serviceContractValues.filter(item => item.serviceId === id)[0]?.serviceContractId : 0,
          contractId:+this.getID,
          serviceId:id
        })
      })
      this.form.patchValue({
        serviceContract: servicePayload
      })
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

  getAllServices() {
    this.ApiService.get(global_API_getAllServices).subscribe((res: any) => {
      if (res.data) {
        this.servicesList = []
        res.data.map((item: any) => {
          this.servicesList.push({
            name: this.selectedLang == 'ar' ? item.nameAr : item.nameEn,
            code: item.serviceId
          })
        })
      }

    })
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

