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
import { SelectComponent } from '../../../components/select/select.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { environment } from '../../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';

const global_PageName = 'slider.pageName';
const global_API_deialis = 'Sliders';
const global_API_create = 'Sliders';
const global_API_update = 'Sliders';
const global_routeUrl = '/slider' 

@Component({
  selector: 'app-slider-details',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, TitleCasePipe, EditModeImageComponent, ButtonModule, NgIf, DialogComponent, SelectComponent, CheckBoxComponent, InputTextComponent, RouterModule, BreadcrumpComponent, UploadFileComponent],
  templateUrl: './slider-details.component.html',
  styleUrl: './slider-details.component.scss'
})
export class SliderDetailsComponent {

  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  editAttachmentMode: boolean = false;
  private confirm = inject(ConfirmMsgService)
  minEndDate: Date = new Date()
  editImageProps: IEditImage = {
    props: { visible: true, imgSrc: '' },
    onEditBtn: () => { this.editImageProps.props.visible = false; this.editAttachmentMode = false; }
  };
  form = new FormGroup({
    url: new FormControl(''),
    image: new FormControl(''),
    displayOrder: new FormControl(0, [Validators.required, Validations.onlyNumberValidator()]),
    isActive: new FormControl(true),
    id: new FormControl(this.getID | 0)
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  selectedLang: any;
  languageService = inject(LanguageService);


  get getID() {
    return this.route.snapshot.params['id']
  }


  get isRequiredError(): boolean {
    return (this.form.get('image')?.touched && this.form.get('image')?.hasError('required')) || false;
  }

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


  onStartDateChange(date: Date) {
    this.minEndDate = date
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
          label: this.languageService.translate(this.pageName() + '_' + this.tyepMode() + '_crumb'),
        },
      ]
    }
  }

  API_getItemDetails() {
    this.ApiService.get(`${global_API_deialis}/${this.getID}`).subscribe((res: any) => {
      const d = res?.data ?? res;
      if (d) {
        this.form.patchValue({ url: d.url, displayOrder: d.displayOrder, isActive: d.isActive });
        this.editImageProps.props.imgSrc = d.image ?? '';
        this.editAttachmentMode = true;
      }
    });
  }

  onSubmit() {
    const raw = this.form.value;
    const payload: any = {
      imageBase64: raw.image || null,
      url: raw.url || null,
      displayOrder: Number(raw.displayOrder) || 0,
      isActive: raw.isActive ?? true
    };
    if (this.tyepMode() === 'Edit') payload.id = Number(this.getID);
    if (this.tyepMode() === 'Add') this.API_forAddItem(payload);
    else this.API_forEditItem(payload);
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
    this.ApiService.post(global_API_create, payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) this.navigateToPageTable();
    });
  }

  API_forEditItem(payload: any) {
    this.ApiService.put(global_API_update, payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) this.navigateToPageTable();
    });
  }


}

