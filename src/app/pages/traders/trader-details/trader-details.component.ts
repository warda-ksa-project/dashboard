import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { UploadFileComponent } from "../../../components/upload-file/upload-file.component";
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { StepperModule } from 'primeng/stepper';
import { Validations, removePtags } from '../../../validations';
import { environment } from '../../../../environments/environment';
import { MapComponent } from '../../../components/map/map.component';
import { SelectComponent } from '../../../components/select/select.component';

const global_PageName = 'trader.pageName';
const global_routeUrl = 'traders'
const global_API_details = 'Trader' + '/GetTraderById';
const global_API_create = 'Trader' + '/Create';
const global_API_update = 'Trader' + '/Update';

@Component({
  selector: 'app-trader-details',
  standalone: true,
  imports: [ReactiveFormsModule,SelectComponent, StepperModule,MapComponent, EditModeImageComponent, TitleCasePipe, TranslatePipe, ButtonModule, NgIf, DialogComponent, InputTextComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './trader-details.component.html',
  styleUrl: './trader-details.component.scss'
})
export class TraderDetailsComponent  {

  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  lat:any=0
  lng:any=0
  showMap=false
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  cities:any[]=[]
  adress: any[] = [{
    expalinedAddress: '',
    latitude: '',
    logitude: '',
    cityId:'',
    userId: Number(localStorage.getItem('userId')) || 0
  }]
  files:any[]=[
    {
      iban:'',
      license:'',
      cr:''
    }
  ]
  // isAddressValid:boolean=false
  form = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required
      ],
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validations.emailValidator()
      ]
    }),
    phone: new FormControl('', {
      validators: [
        Validators.required,
        Validations.mobileStartWithNumber_5_Validator(),
        Validators.maxLength(9),
        Validators.minLength(9),],
    }),
    password: new FormControl('', {
    
    }),

    storeName: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    cr: new FormControl<any>('', {
        
    }),
    license: new FormControl<any>('', {
     
    }),
    iban: new FormControl<any>('', {
     
    }),
    image: new FormControl<any>('', {
     
    }),

    numberOfBranches: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    addresses: new FormControl<any>(''),
    expalinedAddress: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    cityId: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),


    // street: new FormControl('', {
    //   validators: [
    //     Validators.required,
    //   ]
    // }),
    // district: new FormControl('', {
    //   validators: [
    //     Validators.required,
    //   ]
    // }),
    // buildNo: new FormControl<any>('', {
    //   validators: [
    //     Validations.onlyNumberValidator()
    //   ]
    // }),
    // floorNo: new FormControl<any>('', {
    //   validators: [
    //     Validators.required,
    //     Validations.onlyNumberValidator()
    //   ]
    // }),
    // flatNo: new FormControl<any>('', {
    //   validators: [
    //     Validators.required,
    //     Validations.onlyNumberValidator()
    //   ]
    // }),
    logitude: new FormControl('', {
      validators: [
        Validators.required,
        Validations.decimalNumberValidators()
      ]
    }),
    latitude: new FormControl('', {
      validators: [
        Validators.required,
        Validations.decimalNumberValidators()
      ]
    }),
    id: new FormControl(this.getID | 0),
  })

  editTraderImageMode:boolean=false
  editCRMode:boolean=false
  editLicenseMode:boolean=false
  editIBanMode:boolean=false


  editImageProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editImageProps.props.visible = false;
      this.editCRMode = false;
    }
  };

  editImageCRProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editImageCRProps.props.visible = false;
      this.editCRMode = false;
    }
  };

  editImageLicenseProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editImageProps.props.visible = false;
      this.editLicenseMode = false;
    }
  };

  editImageIBanProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editImageProps.props.visible = false;
      this.editIBanMode = false;
    }
  };

  editTraderImageProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editTraderImageProps.props.visible = false;
      this.editTraderImageMode = false;
    }
  };

  get getID() {
    return this.route.snapshot.params['id']
  }

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {

    this.pageName.set(global_PageName)
    this.getAllCity()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getAllCity()
    });

    // Set password validation based on mode
    if (this.tyepMode() === 'Add') {
      this.form.get('password')?.setValidators([Validators.required]);
    } else {
      this.form.get('password')?.clearValidators();
    }
    this.form.get('password')?.updateValueAndValidity();

    // this.form.get('street')?.valueChanges.subscribe(res => {
    //   this.adress[0].street = res;
    //   this.form.patchValue({
    //     addresses: this.adress
    //   })
    // })
    // this.form.get('buildNo')?.valueChanges.subscribe(res => {
    //   this.adress[0].buildNo = +res
    //   this.form.patchValue({
    //     addresses: this.adress
    //   })


    // })
    // this.form.get('flatNo')?.valueChanges.subscribe(res => {
    //   this.adress[0].flatNo = +res
    //   this.form.patchValue({
    //     addresses: this.adress
    //   })


    // })
    // this.form.get('district')?.valueChanges.subscribe(res => {
    //   this.adress[0].district = res
    //   this.form.patchValue({
    //     addresses: this.adress
    //   })


    // })
    // this.form.get('floorNo')?.valueChanges.subscribe(res => {
    //   this.adress[0].floorNo = +res
    //   this.form.patchValue({
    //     addresses: this.adress
    //   })
    //   console.log('dd',this.form.value)


    // })
    this.form.get('latitude')?.valueChanges.subscribe(res => {
      this.adress[0].latitude = res
      this.form.patchValue({
        addresses: this.adress
      })


    })
    this.form.get('logitude')?.valueChanges.subscribe(res => {
      this.adress[0].logitude = res
      this.form.patchValue({
        addresses: this.adress
      })


    })
    this.form.get('expalinedAddress')?.valueChanges.subscribe(res => {
      this.adress[0].expalinedAddress = res
      this.form.patchValue({
        addresses: this.adress
      })


    })
    this.form.get('cityId')?.valueChanges.subscribe(res => {
      this.adress[0].cityId = res
      this.form.patchValue({
        addresses: this.adress
      })


    })
    this.form.get('addresses')?.valueChanges.subscribe(res => {
      this.isAddressVaild()
    })
    this.form.get('iban')?.valueChanges.subscribe(res => {
      this.files[0].iban=res
      this.isFilesValid()
    })
    this.form.get('cr')?.valueChanges.subscribe(res => {
      console.log("TraderDetailsComponent  this.form.get  res:", res)
      this.files[0].cr=res
      this.isFilesValid()
    })
    this.form.get('license')?.valueChanges.subscribe(res => {
      this.files[0].license=res
      this.isFilesValid()
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

  onChangeLocation(event:any){
    this.form.patchValue({
      latitude:String(event.lat),
      logitude:String(event.lng)
    })
  }


  // getMainCategory(){
  //   this.ApiService.get('MainCategory/GetAll').subscribe((res: any) => {
  //     if (res.data){
  //       this.categoryList=[]
  //       res.data.map((item:any) => {
  //         this.categoryList.push({
  //           name:this.selectedLang=='en'?item.enName:item.arName,
  //           code:item.id
  //         })
  //       })
  //     }

  //   })
  // }
  getAllCity(){
    this.ApiService.get('city/GetAll').subscribe((res: any) => {
      if (res.data) {
        this.cities=[]
       res.data.map((city:any)=>{
           this.cities.push({
            name:this.selectedLang=='en'?city.enName :city.arName,
            code:city.id
           })
       })
      }
    })
  }
  API_getItemDetails() {
    this.ApiService.get(`${global_API_details}`, { id: this.getID }).subscribe((res: any) => {
      if (res.data) {
        this.form.patchValue({
          ...res.data,
          phone: res.data.phone?.toString().trim(), // Ensure phone is string and trimmed
          expalinedAddress:res.data.addresses[0].expalinedAddress,
          cityId:res.data.addresses[0].cityId,
          // buildNo:res.data.addresses[0].buildNo,
          // flatNo:res.data.addresses[0].flatNo,
          // district:res.data.addresses[0].district,
          // floorNo:res.data.addresses[0].floorNo,
          latitude:String(res.data.addresses[0].latitude),
          logitude:String(res.data.addresses[0].logitude),
          
        })
        this.lat=String(res.data.addresses[0].latitude);
        this.lng=String(res.data.addresses[0].logitude);
        this.showMap=true
        this.editTraderImageProps.props.imgSrc = res.data.image;
        this.editImageIBanProps.props.imgSrc = res.data.iban;
        this.editImageCRProps.props.imgSrc = res.data.cr;
        this.editImageLicenseProps.props.imgSrc = res.data.license;
        this.editCRMode = true;
        this.editIBanMode = true;
        this.editLicenseMode = true;
        this.editTraderImageMode = true;

        // Update files array with the URLs from API for validation
        this.files[0] = {
          iban: res.data.iban,
          license: res.data.license,
          cr: res.data.cr
        };

        // Update form controls with file URLs
        this.form.patchValue({
          cr: res.data.cr,
          license: res.data.license,
          iban: res.data.iban,
          image: res.data.image
        });


        this.adress = [{
          expalinedAddress:res.data.addresses[0].expalinedAddress,
          cityId:res.data.addresses[0].cityId,
          // buildNo:res.data.addresses[0].buildNo,
          // flatNo:res.data.addresses[0].flatNo,
          // district:res.data.addresses[0].district,
          // floorNo:res.data.addresses[0].floorNo,
          latitude:String(res.data.addresses[0].latitude),
          logitude:String(res.data.addresses[0].logitude),
          userId: Number(localStorage.getItem('userId')) || 0
        }]

        // this.imageList = res.data.image;
        // if (this.imageList.length != 0) {
        //   this.addUrltoMedia(this.imageList);
        // }
        
        // Debug: Check form validation after loading data
        setTimeout(() => {
          this.checkFormValidation();
        }, 100);
      }
    })
  }
  // addUrltoMedia(list: any) {
  //   list.forEach((data: any) => {
  //     console.log("ProductsDetailsComponent  list.forEach  data:", data)
  //     data.src = this.imageUrl + data.image;
  //   });
  // }
  // onSelect(event: any): void {
  //   const files = event.currentFiles; // Array of selected files
  //   console.log(files);

  //   const promises = files.map((file: File) => {
  //     return this.convertFileToBase64(file).then((base64String: string) => ({
  //       src: base64String,
  //       mediaTypeEnum: file.type.startsWith('image/') ? 1 : file.type.startsWith('video/') ? 2 : 0,
  //     }));
  //   });

  //   Promise.all(promises)
  //     .then((processedFiles) => {
  //       console.log(processedFiles); // Final processed array
  //       this.uploadedFiles.push(...processedFiles); // Add to `uploadedFiles`
  //     })
  //     .catch((error) => {
  //       console.error('Error processing files:', error);
  //     });
  // }

  setPayload(keysToRemove: string[], payload: any) {
    console.log("TraderDetailsComponent  setPayload   this.form.value:", this.form.value)
    keysToRemove.forEach((key) => {
      this.form.get(key)?.clearValidators();
      this.form.get(key)?.updateValueAndValidity();
      delete payload[key];

    });
    console.log("TraderDetailsComponent  setPayload   this.form.value:", this.form.value)

  }

  onFileEdit(control:string){
    this.form.get(control)?.setValue(null)
    
    // Switch to upload mode when editing files
    switch(control) {
      case 'cr':
        this.editCRMode = false;
        break;
      case 'license':
        this.editLicenseMode = false;
        break;
      case 'iban':
        this.editIBanMode = false;
        break;
      case 'image':
        this.editTraderImageMode = false;
        break;
    }
  }


  onSubmit() {
    // if(this.form.value.image){
    //   let x =   this.form.value.image.map((re:any)=>({
    //        ...re,
    //        "id": 0,
    //        "productId": +this.getID||0,
    //      }))
    //      this.form.patchValue({
    //        image:x
    //      })
    //    }
    console.log("TraderDetailsComponent  onSubmit  this.form.value:", this.form.value)
    console.log("TraderDetailsComponent  onSubmit  this.form.value.cr.length>=0:", this.form.value.cr[0]?.image)

    const payload = {
      ...this.form.value,
      numberOfBranches: +this.form.value.numberOfBranches,
      cr: this.form.value.cr[0]?.image?this.form.value.cr[0]?.image:this.form.value.cr,
      license: this.form.value.license[0]?.image?this.form.value.license[0]?.image:this.form.value.license,
      iban: this.form.value.iban[0]?.image? this.form.value.iban[0]?.image:this.form.value.iban,
      "enDescription": null,
      "arDescription": null,
    }

    this.setPayload([
      'expalinedAddress',
      // 'street',
      // 'district',
      // 'buildNo',
      // 'floorNo',
      'cityId',
      'logitude',
      'latitude'
    ], payload)

    console.log('ggg', payload)

    if (this.tyepMode() == 'Add') {

      this.API_forAddItem(payload)

    }
    else {
      this.API_forEditItem(payload)
    }
  }

  navigateToPageTable() {
    this.router.navigateByUrl(global_routeUrl)
  }
  onValueStepperChange(value:any){
    this.gotTo(value)

  }
  gotTo(pageNumber:number){
    if(pageNumber==3)
  {
    this.lat=this.form.value.addresses[0].latitude??0
    this.lng=this.form.value.addresses[0].logitude??0
    
  }

  }
  isAddressVaild() {
    const isAddressValid = this.adress.every((obj: any) =>
      Object.values(obj).every(value => value !== null && value !== undefined && value !== '')
    );

    return isAddressValid
  }

  isFilesValid(){
    // Check each file individually - either it's in edit mode (has URL) or has uploaded file
    const crValid = this.editCRMode || (this.form.get('cr')?.value && this.form.get('cr')?.value.length > 0);
    const licenseValid = this.editLicenseMode || (this.form.get('license')?.value && this.form.get('license')?.value.length > 0);
    const ibanValid = this.editIBanMode || (this.form.get('iban')?.value && this.form.get('iban')?.value.length > 0);
    const imageValid = this.editTraderImageMode || (this.form.get('image')?.value && this.form.get('image')?.value !== '');
    
    return crValid && licenseValid && ibanValid && imageValid;
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

  // Debug method to check form validation status
  checkFormValidation() {
    console.log('Form valid:', this.form.valid);
    console.log('Form errors:', this.getFormValidationErrors());
    console.log('Files valid:', this.isFilesValid());
    console.log('Form values:', this.form.value);
  }

  getFormValidationErrors() {
    let formErrors: any = {};
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors = this.form.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });
    return formErrors;
  }

 
}
