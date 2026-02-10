import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { userType } from '../../conts';
import { SelectComponent } from '../../components/select/select.component';
import { IEditImage } from '../../components/edit-mode-image/editImage.interface';
import { TextareaModule } from 'primeng/textarea';
import { LanguageService } from '../../services/language.service';

const global_PageName = 'notifications.pageName';
const global_API_create =  'Notification/send';
const global_API_getUsersByUserTypeId = 'User/GetByUserType';

@Component({
  selector: 'app-add-notifications',
  standalone: true,
 imports: [ReactiveFormsModule, TextareaModule, TranslatePipe, SelectComponent, ButtonModule, InputTextComponent, RouterModule],
  templateUrl: './add-notifications.component.html',
  styleUrl: './add-notifications.component.scss'
})
export class AddNotificationsComponent {

 pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  userTypeList = userType
  usersList: Array<{ name: string; code: number }> = [];
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

  minEndDate:Date =new Date()
  form = new FormGroup({
    id: new FormControl<number>(0),
    titleAr: new FormControl('', {
      validators: [
        Validators.required
      ],
    }),
    titleEn: new FormControl('', {
      validators: [
        Validators.required
      ],
    }),
    userType: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
      ]
    }),
    userId: new FormControl<number[]>([], {
      validators: [
        Validators.required,
      ]
    }),
    bodyAr: new FormControl('', {
      validators: [
        Validators.required,
      ]
    }),
    bodyEn: new FormControl('', {
      validators: [
        Validators.required,
      ]
    })
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  get getID() {
    return this.route.snapshot.params['id']
  }

  get isRequiredError(): boolean {
    const control = this.form.get('image');
    return control?.touched && control?.hasError('required') || false;
  }
  selectedLang: any;
    languageService = inject(LanguageService);

  ngOnInit() {
    this.pageName.set(global_PageName)
    this.getBreadCrumb();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
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

  onSubmit() {
    const raw = this.form.getRawValue();
    const payload = {
      Id: Number(raw.id ?? 0),
      TitleAr: String(raw.titleAr ?? ''),
      TitleEn: String(raw.titleEn ?? ''),
      BodyAr: String(raw.bodyAr ?? ''),
      BodyEn: String(raw.bodyEn ?? ''),
      UserId: Array.isArray(raw.userId) ? raw.userId.map(Number) : [],
      UserType: raw.userType,
    };

    this.API_forAddItem(payload);
  }

  API_forAddItem(payload: any) {
    this.ApiService.post(global_API_create, payload).subscribe(res => {
    })
  }

  onUserTypeSelected(userTypeId: number) {
    this.form.patchValue({ userType: userTypeId, userId: [] });
    this.loadUsersByUserTypeId(userTypeId);
  }

  loadUsersByUserTypeId(userTypeId: number) {
    if (!userTypeId) {
      this.usersList = [];
      return;
    }

    this.ApiService.get(global_API_getUsersByUserTypeId, { UserTypeId: userTypeId }).subscribe((res: any) => {
      const raw = res?.data;
      const data: any[] = Array.isArray(raw) ? raw : (raw ? [raw] : []);

      this.usersList = data
        .map((u: any) => ({
          name: this.getUserDisplayName(u),
          code: Number(u?.id ?? u?.userId ?? u?.code ?? 0),
        }))
        .filter((x: any) => x.code);
    });
  }

  private getUserDisplayName(u: any): string {
    const isAr = this.selectedLang === 'ar';
    const name =
      (isAr ? (u?.arName ?? u?.nameAr ?? u?.fullNameAr ?? u?.fullName) : (u?.enName ?? u?.nameEn ?? u?.fullNameEn ?? u?.fullName)) ??
      u?.name ??
      u?.userName ??
      u?.mobileNumber ??
      u?.phoneNumber ??
      u?.email ??
      u?.id;

    return String(name ?? '');
  }

}


