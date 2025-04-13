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
import { LanguageService } from '../../../services/language.service';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { SelectComponent } from '../../../components/select/select.component';
import { environment } from '../../../../environments/environment';
import { GalleryComponent } from '../../../components/gallery/gallery.component';
import { Roles } from '../../../conts';

const global_PageName = 'sub_category.pageName';
const global_routeUrl = 'sub-category'
const global_API_details = 'subCategory' + '/GetSubCategoryById';
const global_API_create = 'subCategory' + '/Create';
const global_API_update = 'subCategory' + '/Update';

@Component({
  selector: 'app-sub-category-details',
  standalone: true,
  imports: [ReactiveFormsModule, GalleryComponent, SelectComponent, EditModeImageComponent, TitleCasePipe, TranslatePipe, ButtonModule, NgIf, DialogComponent, InputTextComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './sub-category-details.component.html',
  styleUrl: './sub-category-details.component.scss'
})
export class SubCategoryDetailsComponent {

  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
role=''
  parentCategoryList: any[] = []
  imageList: any = [{
    src: '',
    mediaTypeEnum: 1
  }];

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
    parentCategoryId: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),
    image: new FormControl(''),
    id: new FormControl(this.getID | 0)
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

  get getID() {
    return this.route.snapshot.params['id']
  }

  selectedLang: any;
  languageService = inject(LanguageService);

  ngOnInit() {

    this.pageName.set(global_PageName)
    this.getBreadCrumb();
    this.getMainCategory();
    this.getRoles()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
      this.getMainCategory()
      this.getRoles()
    });
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
  getRoles(){
    this.ApiService.get('Auth/getRoles').subscribe((res:any)=>{
      this.role=res.data
    })
  }
  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
          routerLink:  this.role==Roles.admin?'/dashboard-admin':'/dashboard-trader',
        },
        {
          label: this.languageService.translate(this.pageName() + '_' + this.tyepMode() + '_crumb'),
        },
      ]
    }
  }

  getMainCategory() {
    this.ApiService.get('MainCategory/GetAll').subscribe((res: any) => {
      if (res.data) {
        this.parentCategoryList = []
        res.data.map((item: any) => {
          this.parentCategoryList.push({
            name: this.selectedLang == 'en' ? item.enName : item.arName,
            code: item.id
          })
        })
      }

    })
  }
  API_getItemDetails() {
    this.ApiService.get(`${global_API_details}`, { SubCategoryId: this.getID }).subscribe((res: any) => {
      if (res) {
        this.form.patchValue(res.data)
        if (res.data.image) {
          this.imageList[0].src = res.data.image;
          this.addUrltoMedia(this.imageList);
        }
      }
    })
  }
  addUrltoMedia(list: any) {
    list.forEach((data: any) => {
      data.src = data.src;
    });
  }
  onSubmit() {
    const payload = {
      ...this.form.value,
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

