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
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { packageHourVistList, PackageTypeList } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { LanguageService } from '../../../services/language.service';
import { parseISO } from 'date-fns';
import { TranslatePipe } from '@ngx-translate/core';



const global_PageName = 'pkg.pageName';
const global_API_deialis = 'package' + '/GetPackage';
const global_API_create = 'package' + '/CreatePackage';
const global_API_update = 'package' + '/UpdatePackage';
// const global_API_get_workTime =global_PageName+'/GetWorkTimeByPacakgeId/';
const global_API_get_all_workTime = 'WorkingTime/GetAll'

const global_routeUrl = 'package'

@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, TitleCasePipe, ButtonModule, SelectComponent, CheckBoxComponent, NgIf, DialogComponent, DatePickerComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.scss'
})
export class PackageDetailsComponent {
  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  typeOfPackageList: any[] = PackageTypeList
  contractTypeList: any[] = [];
  serviceTypeList: any[] = [];
  workingTimeList: any[] = []
  packageWorkTimesValues: any[] = []
  visitHoursList: any = packageHourVistList

  form = new FormGroup({
    nameEn: new FormControl('', {
      validators: [
        Validators.required,
        Validations.englishCharsValidator()
      ],
    }),
    nameAr: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.arabicCharsValidator()
      ]
    }),
    providerNumber: new FormControl<any>(null, {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    typeOfPackage: new FormControl<any>('', {
      validators: [
        Validators.required
      ]
    }),
    visitNumber: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    visitHours: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator(),
      ]
    }),
    price: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    descriptionEn: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    descriptionAr: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    enInstraction: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    arInstraction: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    isActive: new FormControl(false, {
    }),
    contractTypeId: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    serviceId: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    packageWorkTimes: new FormControl<any>('', {
      validators: [
        Validators.required,
      ]
    }),
    image: new FormControl('', {
    }),
    packageId: new FormControl(this.getID | 0),

  })

  bredCrumb: IBreadcrumb = {
    crumbs: [
    ]
  }

  selectedLang: any;
  languageService = inject(LanguageService);
  get getID() {
    return this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.getBreadCrumb()
    this.getAllServices()
    this.getAllWorkingTime()
    this.pageName.set(global_PageName)
    if (this.tyepMode() !== 'Add') {
      // this.getWorkTimeByPkgId()
      this.API_getItemDetails()
    }

    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      console.log("CityDetailsComponent  this.languageService.translationService.onLangChange.subscribe   this.selectedLang:", this.selectedLang)
      this.API_getItemDetails();
      this.getAllServices();
      this.getAllWorkingTime()
      this.getBreadCrumb()

    })
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
          label: this.languageService.translate(this.pageName()+ '_'+this.tyepMode()+'_crumb'),
        },
      ]
    }
  }

  // getWorkTimeByPkgId(){
  //   this.ApiService.get(global_API_get_workTime+this.getID).subscribe(res=>{
  //        if(res)
  //         console.log("PackageDetailsComponent  this.ApiService.get  res:", res)
  //   })
  // }

  getAllWorkingTime() {
    this.ApiService.get(global_API_get_all_workTime).subscribe((res: any) => {
      if (res.data) {
        this.workingTimeList = []
        res.data.map((item: any) => {
          this.workingTimeList.push({
            name: this.convertToHours(parseISO(item.startDate)) + ' - ' + this.convertToHours(parseISO(item.endDate)),
            code: item.workTimeId,
          })
        })
        console.log(this.workingTimeList);
      }
    })
  }

  convertToHours(timestamp: any) {
    const date: Date = new Date(timestamp);
    let hours: number = date.getHours();  // Use local time (getHours() instead of getUTCHours())
    const minutes: number = date.getMinutes();
    const ampm: string = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedTime: string = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return formattedTime;
  }


   // Fetch all services
   getAllServices() {
    this.ApiService.get('Service/GetAll').subscribe((res: any) => {
      if (res.data) {
        this.serviceTypeList = res.data.map((item: any) => ({
          name: this.selectedLang == 'ar' ? item.nameAr : item.nameEn,
          code: item.serviceId,
        }));
      }
    });
  }

  getAllContract(serviceId: any) {
    console.log("Fetching contracts for serviceId:", serviceId);

    if (!serviceId) {
      this.contractTypeList = [];
      return;
    }

    this.ApiService.get(`ContractType/GetByServiceId/${serviceId}`).subscribe((res: any) => {
      if (res.data) {
        this.contractTypeList = res.data.map((item: any) => ({
          name: this.selectedLang == 'ar' ? item.arName : item.enName,
          code: item.contractTypeId,
        }));
        console.log("Contracts Updated:", this.contractTypeList);
      }
    });
  }


  onServiceChange(serviceId: any) {
    console.log("Service changed to:", serviceId);
    if (!serviceId) {
      this.contractTypeList = []; // Clear contracts if no service is selected
      return;
    }
    this.form.get('serviceId')?.setValue(serviceId);
    this.getAllContract(serviceId);
  }


  // onTypepkgSelected(item: any) {
  //   let visitNumberControl = this.form.get('visitNumber');
  //   visitNumberControl?.reset()
  //   const maxNumber = [0, 1, 20, 60, 120, 240  ,5]
  //   visitNumberControl?.setValidators([Validations.isEqualNumber(maxNumber[item], this.languageService.translate('pkg.visit_number_isMax'))]);
  //   visitNumberControl?.updateValueAndValidity();

  // }

  // onVisitNumberChange(value: string) {
  //   if (this.form.value.typeOfPackage && this.tyepMode() == 'Edit') {
  //     let visitNumberControl = this.form.get('visitNumber');
  //     const maxNumber = [0, 1, 20, 60, 120, 240 , 5]
  //     visitNumberControl?.setValidators([Validations.isEqualNumber(maxNumber[this.form.value.typeOfPackage], this.languageService.translate('pkg.visit_number_isMax'))]);
  //     visitNumberControl?.updateValueAndValidity();
  //   }

  // }


  API_getItemDetails() {
    if (this.getID) {
      this.ApiService.get(`${global_API_deialis}/${this.getID}`).subscribe((res: any) => {
        if (res) {
          let pkWorkingTime: number[] = [];
          this.form.patchValue(res.data);

          // Ensure packageWorkTimes is properly formatted
          this.form.value.packageWorkTimes.map((item: any) => {
            pkWorkingTime.push(item.workTimeId);
            this.packageWorkTimesValues.push({
              workTimeId: item.workTimeId,
              packageWorkTimeId: item.packageWorkTimeId
            });
          });

          this.form.patchValue({
            packageWorkTimes: pkWorkingTime
          });

          // Trigger contract list update based on the existing serviceId
          const selectedServiceId = this.form.get('serviceId')?.value;
          if (selectedServiceId) {
            console.log("Edit Mode - Fetching contracts for serviceId:", selectedServiceId);
            this.onServiceChange(selectedServiceId);  // Call onServiceChange
          }
        }
      });
    }
  }


  onSubmit() {
    let workingTimeId: any = []
    let workTimePayload: any = []
    workingTimeId = this.form.value.packageWorkTimes

    if (this.tyepMode() == 'Add') {
      workingTimeId.map((item: any) => {
        workTimePayload.push({
          "packageWorkTimeId": 0,
          "packageId": 0,
          "workTimeId": item
        })
      })
      this.form.patchValue({
        packageWorkTimes: workTimePayload
      })
      this.form.value.providerNumber = Number( this.form.value.providerNumber);
      this.API_forAddItem(this.form.value)
    }
    else {
      workingTimeId.map((id: any) => {
        workTimePayload.push({
          "packageWorkTimeId": this.packageWorkTimesValues.filter(item => item.workTimeId === id)[0]?.packageWorkTimeId ? this.packageWorkTimesValues.filter(item => item.workTimeId === id)[0]?.packageWorkTimeId : 0,
          "packageId": +this.getID,
          "workTimeId": id
        })
      })
      this.form.patchValue({
        packageWorkTimes: workTimePayload
      })
      this.form.value.providerNumber = Number( this.form.value.providerNumber);
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

