import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { UploadFileComponent } from "../../../components/upload-file/upload-file.component";
import { userType } from '../../../conts';
import { SelectComponent } from '../../../components/select/select.component';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { CheckBoxComponent } from "../../../components/check-box/check-box.component";
import { DatePickerComponent } from "../../../components/date-picker/date-picker.component";
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { environment } from '../../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';



const global_PageName = 'category.pageName';
const global_API_create = 'SubCategories';
const global_API_update = 'SubCategories';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, TitleCasePipe, EditModeImageComponent, ButtonModule, NgIf, SelectComponent, DialogComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent {
pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  selectedLang: any;
  languageService = inject(LanguageService);
  private confirm = inject(ConfirmMsgService);
  parentCategoryList:any[]=[]
  form = new FormGroup({
    enName: new FormControl('', [Validators.required]),
    arName: new FormControl('', [Validators.required]),
    parentCategoryId: new FormControl<number | null>(null),
    image: new FormControl(''),
    id: new FormControl(0)
  })


  bredCrumb: IBreadcrumb = {
    crumbs: [

    ]
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
    return this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.getBreadCrumb();
    this.ngOnInitLoadData();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
  }

  tyepMode() {
    const url = this.router.url;
    let result = 'Add'
    if (url.includes('edit')) result = 'Edit'
    else if (url.includes('view')) result = 'View'
    else result = 'Add'

    // this.bredCrumb.crumbs[1].label = result + ' ' +this.languageService.translate(this.pageName());
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


  onSubmit() {
    const raw = this.form.value;
    const parentId = raw.parentCategoryId ?? 0;
    if (this.tyepMode() === 'Add' && !parentId) return; // SubCategory requires parent
    const payload: any = {
      arName: raw.arName ?? '',
      enName: raw.enName ?? '',
      parentCategoryId: parentId,
      imageBase64: raw.image || null
    };
    if (this.tyepMode() === 'Edit') payload.id = Number(this.getID);
    if (this.tyepMode() === 'Add') this.addFQS(payload);
    else this.editFQS(payload);
  }

  ngOnInitLoadData() {
    this.ApiService.get('Categories').subscribe((res: any) => {
      const list = res?.data ?? res ?? [];
      this.parentCategoryList = (Array.isArray(list) ? list : [list]).map((c: any) => ({
        name: this.selectedLang === 'ar' ? (c.arName ?? c.enName) : (c.enName ?? c.arName),
        code: c.id
      }));
    });
    if (this.tyepMode() !== 'Add') {
      this.ApiService.get(`SubCategories/${this.getID}`).subscribe((res: any) => {
        const d = res?.data ?? res;
        if (d) {
          this.form.patchValue({
            enName: d.enName, arName: d.arName, parentCategoryId: d.parentCategoryId,
            id: d.id, image: d.image
          });
          this.editImageProps.props.imgSrc = d.image ?? '';
          this.editMode = true;
        }
      });
    }
  }



  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.router.navigateByUrl('/category')
  }

  onConfirmMessage() {
    this.router.navigateByUrl('/category')
  }

  addFQS(payload: any) {
    this.ApiService.post(global_API_create, payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) this.router.navigateByUrl('/category');
    });
  }

  editFQS(payload: any) {
    this.ApiService.put(global_API_update, payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) this.router.navigateByUrl('/category');
    });
  }

  // getClientOrders() {
  //   this.ApiService.get(`Order/GetOrdersByClientIdDashboard/${this.clientid}`).subscribe((res: any) => {
  //     console.log(res);
  //     this.clientOrdersList = res.data;
  //   })
  // }



}

