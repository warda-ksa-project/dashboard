import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
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
import { SelectComponent } from '../../../components/select/select.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { StepperModule } from 'primeng/stepper';
import { GalleryComponent } from '../../../components/gallery/gallery.component';
import { environment } from '../../../../environments/environment';
import { Validations } from '../../../validations';
import { Roles } from '../../../conts';

const global_PageName = 'products.pageName';
const global_routeUrl = 'product'
const global_API_details = 'product' + '/GetById';
const global_API_create = 'product' + '/Create';
const global_API_update = 'product' + '/Update';

@Component({
  selector: 'app-products-details',
  standalone: true,
  imports: [ReactiveFormsModule,NgFor, CheckBoxComponent, GalleryComponent, StepperModule, SelectComponent, EditorComponent, EditModeImageComponent, TitleCasePipe, TranslatePipe, ButtonModule, NgIf, DialogComponent, InputTextComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  providers:[DatePipe],
  templateUrl: './products-details.component.html',
  styleUrl: './products-details.component.scss'
})
export class ProductsDetailsComponent {


  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  arrayFrom = Array.from;
  minEndDate=new Date()
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  categoryList: any[] = []
  reviews:any[]=[]
  payloadFinal:any={}

  discountType: any[] = [
    {
      name: 'Amount',
      code: 1
    },
    {
      name: 'Precentage',
      code: 2
    }

  ]
  hasDiscount = false
  imageList: any;
  form = new FormGroup({
    enName: new FormControl('', {
      validators: [
        Validators.required
      ],
    }),
    arName: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    enDescription: new FormControl('', {
      validators: [
        Validators.required
      ],
    }),
    arDescription: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    stockQuantity: new FormControl('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    hasDiscount: new FormControl<boolean>(false),
    discountType: new FormControl<any>('', {
      validators: [
        Validators.required,
      ],
    }),
    amount: new FormControl<any>('', {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    price: new FormControl('',{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    priceAfterDiscount: new FormControl('',{
      validators: [
   
      ],
    }),

    image: new FormControl<any>([]),
    id: new FormControl(this.getID | 0),
    startDate:new FormControl<any>('',
      {
        validators: [
          Validators.required,
        ]
      }
    ),
    endDate:new FormControl<any>('',{
      validators: [
        Validators.required
      ]
    }),
    categoryId: new FormControl('', {
      validators: [
        Validators.required,
      ],
    })
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
    apiService=inject(ApiService)
    role:any=''
  get getID() {
    return this.route.snapshot.params['id']
  }

  selectedLang: any;
  languageService = inject(LanguageService);
  isPastDate(date: Date): boolean {
    const today = new Date();
    
    // Remove time from today's date for accurate comparison
    today.setHours(0, 0, 0, 0);
    return date < today;
  }
  ngOnInit() {

    this.pageName.set(global_PageName)
    this.getRoles();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getRoles();
    });


   this.form.get('startDate')?.valueChanges.subscribe((res:any) => {
    if(this.isFirstDateAfter(res,this.form.get('endDate')?.value))
    this.form.get('endDate')?.setValue('')
        if(this.isPastDate(res)==true){
          this.minEndDate=new Date()
        }
        if(this.isPastDate(res)==false){
          this.minEndDate=new Date(res)
        }      
   })

    this.form.get('hasDiscount')?.valueChanges.subscribe((value: any) => {
      if (this.tyepMode() == 'Add') {
        this.form.get('discountType')?.reset();
        this.form.get('amount')?.reset();
        this.form.get('startDate')?.reset();
        this.form.get('endDate')?.reset();
      }

      if (value) {
        this.hasDiscount = true
        this.form.get('discountType')?.setValidators([Validators.required]);
        this.form.get('amount')?.setValidators([Validators.required]);
        this.form.get('startDate')?.setValidators([Validators.required]);
        this.form.get('endDate')?.setValidators([Validators.required]);

      } else {
        this.hasDiscount = false
        this.form.get('discountType')?.setValue(0);
        this.form.get('amount')?.setValue(0);
        this.form.get('startDate')?.setValue(null);
        this.form.get('endDate')?.setValue(null);
        this.form.get('discountType')?.clearValidators();
        this.form.get('amount')?.clearValidators();
        this.form.get('startDate')?.clearValidators();
        this.form.get('endDate')?.clearValidators();
      }
      this.form.get('discountType')?.updateValueAndValidity();
      this.form.get('amount')?.updateValueAndValidity();
      this.form.get('startDate')?.updateValueAndValidity();
      this.form.get('endDate')?.updateValueAndValidity();
      console.log('ggg2222222@@',this.form.value)
    });

    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()
  }
  isFirstDateAfter(start:any, end:any) {
    return new Date(start) > new Date(end);
}

getRoles(){
  this.apiService.get('Auth/getRoles').subscribe((res:any)=>{
    this.role=res.data
  if(this.role)
  this.getAllCategory()
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



  getAllCategory(){
    if(this.role==Roles.trader)
      this.getSubCategory()
    else
     this.getMainCategory()
  }
  getMainCategory() {
    this.ApiService.get('MainCategory/GetAll').subscribe((res: any) => {
      if (res.data) {
        this.categoryList = []
        res.data.map((item: any) => {
          this.categoryList.push({
            name: this.selectedLang == 'en' ? item.enName : item.arName,
            code: item.id
          })
        })
      }

    })
  }
  onValueStepperChange(value:any){
    this.goTo(value)

  }
  goTo(value:number){
    setTimeout(()=>{
      if(value==2){
        this.form.patchValue({
          amount:+this.payloadFinal.amount,
          startDate:this.payloadFinal.startDate,
          endDate:this.payloadFinal.endDate,
          discountType:this.payloadFinal.discountType
        })
      }
      else if (value ==1){
         this.payloadFinal =JSON.parse(JSON.stringify(this.form.value))
         this.payloadFinal.startDate=new Date(this.payloadFinal.startDate)
         this.payloadFinal.endDate=new Date(this.payloadFinal.endDate)
      }
      console.log("ProductsDetailsComponent  setTimeout   payloadFinal:",  this.payloadFinal)
      console.log("ProductsDetailsComponent  goTo  value:", this.form.value)
    })
  }
  getSubCategory() {
    this.ApiService.get('SubCategory/GetSubCategoryByTraderId').subscribe((res: any) => {
      if (res.data) {
        this.categoryList = []
        res.data.map((item: any) => {
          this.categoryList.push({
            name: this.selectedLang == 'en' ? item.enName : item.arName,
            code: item.id
          })
        })
      }

    })
  }
  API_getItemDetails() {
    this.ApiService.get(`${global_API_details}`, { id: this.getID }).subscribe((res: any) => {
      if (res.data) {
        this.reviews=res.data.productReviews
        this.form.patchValue({
          ...res.data,
          startDate:new Date(res.data.startDate),
          endDate:new Date(res.data.endDate)
        })
        this.imageList = res.data.image;
        if (this.imageList.length != 0) {
          this.addUrltoMedia(this.imageList);
        }
        this.payloadFinal =JSON.parse(JSON.stringify(this.form.value))
        this.payloadFinal.startDate=new Date(this.payloadFinal.startDate)
        this.payloadFinal.endDate=new Date(this.payloadFinal.endDate)

      }
    })
  }
  addUrltoMedia(list: any) {
    list.forEach((data: any) => {
      data.src =  data.image;
    });
  }
  // onSelect(event: any): void {
  //   const files = event.currentFiles; // Array of selected files

  //   const promises = files.map((file: File) => {
  //     return this.convertFileToBase64(file).then((base64String: string) => ({
  //       src: base64String,
  //       mediaTypeEnum: file.type.startDatesWith('image/') ? 1 : file.type.startDatesWith('video/') ? 2 : 0,
  //     }));
  //   });

  //   Promise.all(promises)
  //     .then((processedFiles) => {
  //       this.uploadedFiles.push(...processedFiles); // Add to `uploadedFiles`
  //     })
  //     .catch((error) => {
  //     });
  // }
  // goToActivePage_2() {
  //   this.form.patchValue({
  //     amount: this.form.value.amount
  //   })
  // }
  // goToActivePage_3(){
  //   console.log('fff',this.form.value)

  // }

  // goToActivePage_1() {
  //   // if (this.tyepMode() == 'Add') {
  //   //   // this.imageList=this.form.value.image;
  //   //   // this.addUrltoMedia(this.imageList);

  //   // }
   
  //   // this.imageList=this.form.value.image;
  //   console.log('fff',this.form.value)

  // }
  onSubmit() {
    if (this.form.value.image) {
      let x = this.form.value.image.map((re: any) => ({
        ...re,
        "id": 0,
        "productId": +this.getID || 0,
      }))
      this.form.patchValue({
        image: x
      })
    }
    if(this.form.value.startDate){
      const start_year = this.form.value.startDate.getFullYear();
      const start_month = this.form.value.startDate.getMonth();
      const start_day = this.form.value.startDate.getDate();
      const start_date  = new Date(start_year, start_month, start_day, 12);
      const end_year = this.form.value.endDate.getFullYear();
      const end_month = this.form.value.endDate.getMonth();
      const end_day = this.form.value.endDate.getDate();
      const end_date  = new Date(end_year, end_month, end_day, 12);
      this.form.patchValue({
        startDate:start_date,
        endDate:end_date
      })
     }
    const payload = {
      ...this.form.value,
      amount:+this.form.value.amount,
      price:Number(this.form.value.price),
      stockQuantity:Number(this.form.value.stockQuantity)
    }


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
