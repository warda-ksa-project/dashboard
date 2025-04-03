import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Validations } from '../../../validations';
import { environment } from '../../../../environments/environment';
import { Dialog, DialogModule } from 'primeng/dialog';
import { MapComponent } from '../../../components/map/map.component';
import { SelectComponent } from '../../../components/select/select.component';

const global_PageName = 'trader_request.pageName';
const global_routeUrl = 'traderRequest'
const global_API_details = 'Trader' + '/GetTraderRequestById';
const global_API_create = 'Trader' + '/Create';
const global_API_update = 'Trader' + '/Update';

@Component({
  selector: 'app-trader-requests-details',
  standalone: true,
  imports: [ReactiveFormsModule,MapComponent,SelectComponent, FormsModule,Dialog,DialogModule,ButtonModule, StepperModule, EditModeImageComponent, TitleCasePipe, TranslatePipe, ButtonModule, NgIf, DialogComponent, InputTextComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './trader-requests-details.component.html',
  styleUrl: './trader-requests-details.component.scss'
})
export class TraderRequestsDetailsComponent {

  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
action=''
header=''
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  lat:any=0
  lng:any=0
  showMap=false
  cities:any[]=[]
  editTraderImageMode:boolean=false
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
  reasonForRejectionValue=''
  // isAddressValid:boolean=false
  form = new FormGroup({
    userName: new FormControl('', {
      validators: [
      ],
    }),
    email: new FormControl('', {
      validators: [
       
      ]
    }),
    phone: new FormControl('', {
      validators: [
      ],
    }),
    password: new FormControl('', {
    
    }),

    storeName: new FormControl('', {
      validators: [
        
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
        
    //   ]
    // }),
    // district: new FormControl('', {
    //   validators: [
    //   ]
    // }),
    // buildNo: new FormControl<any>('', {
    //   validators: [
    //   ]
    // }),
    // floorNo: new FormControl<any>('', {
    //   validators: [
       
    //   ]
    // }),
    // flatNo: new FormControl<any>('', {
    //   validators: [
       
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

  editImageLicenseProps: IEditImage = {
    props: {
      visible: true,
      imgSrc: ''
    },
    onEditBtn: (e?: Event) => {
      this.editImageProps.props.visible = false;
      this.editMode = false;
    }
  };

  editImageIBanProps: IEditImage = {
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
    this.getAllCity()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getAllCity()
    });

    // this.form.valueChanges.subscribe(res => {
    //   console.log('d---d',this.form.value)
    //   console.log('d===d',(!this.form.valid || !this.isAddressVaild()))
    // })
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
  API_getItemDetails() {
    this.ApiService.get(`${global_API_details}`, { TraderId: this.getID }).subscribe((res: any) => {
      if (res.data) {
        this.form.patchValue({
          ...res.data,
          expalinedAddress:res.data.addresses[0].expalinedAddress,
          cityId:res.data.addresses[0].cityId,
          // buildNo:res.data.addresses[0].buildNo,
          // flatNo:res.data.addresses[0].flatNo,
          // district:res.data.addresses[0].district,
          // floorNo:res.data.addresses[0].floorNo,
          latitude:res.data.addresses[0].latitude,
          logitude:res.data.addresses[0].logitude,
        })
        this.lat=String(res.data.addresses[0].latitude);
        this.lng=String(res.data.addresses[0].logitude);
        this.showMap=true
        this.editTraderImageProps.props.imgSrc = res.data.image;
        this.editImageIBanProps.props.imgSrc =  res.data.iban;
        this.editImageProps .props.imgSrc =  res.data.cr;
        this.editImageLicenseProps.props.imgSrc =  res.data.license;
        this.editMode = true;
        this.adress = [{
          expalinedAddress:res.data.addresses[0].expalinedAddress,
          cityId:res.data.addresses[0].cityId,
          // buildNo:res.data.addresses[0].buildNo,
          // flatNo:res.data.addresses[0].flatNo,
          // district:res.data.addresses[0].district,
          // floorNo:res.data.addresses[0].floorNo,
          latitude:res.data.addresses[0].latitude,
          logitude:res.data.addresses[0].logitude,
          userId: Number(localStorage.getItem('userId')) || 0
        }]
        console.log("TraderDetailsComponent  this.ApiService.get    this.adress:",   this.form.value)

        // this.imageList = res.data.image;
        // if (this.imageList.length != 0) {
        //   this.addUrltoMedia(this.imageList);
        // }
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

    const payload = {
      ...this.form.value,
      numberOfBranches: +this.form.value.numberOfBranches,
      cr: this.form.value.cr[0].image,
      license: this.form.value.license[0].image,
      iban: this.form.value.iban[0].image,
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

  onValueStepperChange(value:any){
    this.gotTo(value)
  console.log("TraderDetailsComponent  onValueStepperChange  value:", value)

  }
  gotTo(pageNumber:number){
    if(pageNumber==3)
  {
    this.lat=this.form.value.addresses[0].latitude??0
    this.lng=this.form.value.addresses[0].logitude??0
    
  }

  }
  navigateToPageTable() {
    this.router.navigateByUrl(global_routeUrl)
  }

  isAddressVaild() {
    const isAddressValid = this.adress.every((obj: any) =>
      Object.values(obj).every(value => value !== null && value !== undefined && value !== '')
    );
    console.log("isAddressVaild  isAddressValid:", isAddressValid)

    return isAddressValid
  }

  isFilesValid(){
    const isFileValid = this.files.every((obj: any) =>
      Object.values(obj).every(value => value !== null && value !== undefined && value !== '')
    );
    console.log("isAddressVaild  isAddressValid:", isFileValid)

    return isFileValid
  }
  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue && this.tyepMode() == 'Edit')
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.navigateToPageTable()

  }

  onConfirmMessage() {
   if(this.action=='approve')
    this.approve()
  else
  this.reject()

  }

  openDialog(value:string){
  this.action=value
    this.showConfirmMessage=true
    if(this.action=='approve')
      this.header='trader_request.q_approve'
    else
    this.header='trader_request.q_reject'

  }

  approve(){
    let payload={
       id: +this.getID,
    }
   this.ApiService.post('trader/ApproveTrader',payload,{ showAlert: true, message: `` }).subscribe(res=>{
         if(res)
          this.navigateToPageTable()
   })
  }

  reject(){
    let payload={
       "userId": +this.getID,
       "rejectionReason": this.reasonForRejectionValue
    }
    this.ApiService.post('trader/RejectTrader',payload,{ showAlert: true, message: `` }).subscribe(res=>{
      if(res)
        this.navigateToPageTable()
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
