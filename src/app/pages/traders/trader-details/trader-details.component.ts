import { Component, inject, signal } from '@angular/core';
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
import { SelectComponent } from '../../../components/select/select.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { StepperModule } from 'primeng/stepper';
import { GalleryComponent } from '../../../components/gallery/gallery.component';
import { environment } from '../../../../environments/environment';
const global_PageName='trader.pageName';
const global_routeUrl ='trader'
const global_API_details='Trader'+'/GetById';
const global_API_create='Trader'+'/Create';
const global_API_update='Trader'+'/Update';

@Component({
  selector: 'app-trader-details',
  standalone: true,
  imports: [ReactiveFormsModule,StepperModule,EditModeImageComponent,TitleCasePipe,TranslatePipe, ButtonModule, NgIf, DialogComponent, InputTextComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './trader-details.component.html',
  styleUrl: './trader-details.component.scss'
})
export class TraderDetailsComponent {

  pageName =signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)

  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
adress:any={}
  form = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required
      ],
    }),
    email: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    phone: new FormControl('', {
      validators: [
        Validators.required
      ],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),

    storeName:new FormControl(0, {
      validators: [
        Validators.required
      ]
    }),
    cr: new FormControl<any>(''),
    license: new FormControl<any>(''),
    iban: new FormControl<any>(''),

    numberOfBranches: new FormControl <any>(''),
    reasonForRejection: new FormControl(0),
    adress: new FormControl([]),
    expalinedAddress: new FormControl(''),

    street: new FormControl(''),
    district: new FormControl(''),
    buildNo: new FormControl<any>(''),
    floorNo: new FormControl<any>(''),
    flatNo: new FormControl<any>(''),
    logitude: new FormControl(''),
    latitude: new FormControl(''),
    id:new FormControl(this.getID|0),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: [ ]
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
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()
  }

  tyepMode() {
    const url = this.router.url;
    let result='Add'
    if (url.includes('edit')) result='Edit'
    else if (url.includes('view')) result= 'View'
    else result= 'Add'
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
    this.ApiService.get(`${global_API_details}`,{id:this.getID}).subscribe((res: any) => {
      if (res.data){
        this.form.patchValue(res.data)
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

  setPayload(keysToRemove: string[],payload:any) {
    keysToRemove.forEach((key) => {
      delete payload[key];
    });
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
    adress:[
      {
        expalinedAddress: this.form.value.expalinedAddress,
        street: this.form.value.street,
        district: this.form.value.district,
        buildNo: +this.form.value.buildNo,
        floorNo: +this.form.value.floorNo,
        flatNo: +this.form.value.flatNo,
        logitude: this.form.value.logitude,
        latitude: this.form.value.latitude,
        userId:Number(localStorage.getItem('userId'))
      }
    ],
    numberOfBranches:+this.form.value.numberOfBranches,
    cr: this.form.value.cr[0].image,
    license: this.form.value.license[0].image,
    iban: this.form.value.iban[0].image,
    }

    this.setPayload([
      'expalinedAddress',
      'street' ,
      'district',
      'buildNo',
      'floorNo',
      'flatNo',
      'logitude',
      'latitude'
    ],payload)
    console.log('ggg',payload)
    if (this.tyepMode() == 'Add'){

      this.API_forAddItem(payload)

    }
    else{
      this.API_forEditItem(payload)
    }
  }

  navigateToPageTable(){
    this.router.navigateByUrl(global_routeUrl)
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue && this.tyepMode()=='Edit')
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
