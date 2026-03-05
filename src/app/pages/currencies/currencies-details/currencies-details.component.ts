import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { CheckBoxComponent } from '../../../components/check-box/check-box.component';
import { UploadFileComponent } from '../../../components/upload-file/upload-file.component';
import { IEditImage } from '../../../components/edit-mode-image/editImage.interface';
import { EditModeImageComponent } from '../../../components/edit-mode-image/edit-mode-image.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-currencies-details',
  standalone: true,
  imports: [
    BreadcrumpComponent,
    ReactiveFormsModule,
    ButtonModule,
    NgIf,
    InputTextComponent,
    DialogComponent,
    CheckBoxComponent,
    UploadFileComponent,
    EditModeImageComponent,
    TranslatePipe,
    TitleCasePipe,
  ],
  templateUrl: './currencies-details.component.html',
  styleUrl: './currencies-details.component.scss',
})
export class CurrenciesDetailsComponent implements OnInit {
  pageName = signal<string>('');
  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  showConfirmMessage = false;
  private confirm = inject(ConfirmMsgService);
  translateService = inject(TranslateService);
  editMode = false;
  selectedLang: any;
  languageService = inject(LanguageService);

  form = new FormGroup({
    enName: new FormControl('', {
      validators: [Validators.required, Validations.englishCharsValidator()],
    }),
    arName: new FormControl('', {
      validators: [Validators.required, Validations.arabicCharsValidator()],
    }),
    code: new FormControl('', {
      validators: [Validators.required],
    }),
    symbol: new FormControl('', {
      validators: [Validators.required],
    }),
    icon: new FormControl(''),
    status: new FormControl(true),
    imageBase64: new FormControl(null),
  });

  bredCrumb: IBreadcrumb = { crumbs: [] };

  get currencyID() {
    return this.route.snapshot.params['id'];
  }

  get isRequiredError(): boolean {
    const control = this.form.get('imageBase64');
    return (control?.touched && control?.hasError('required')) ?? false;
  }

  editImageProps: IEditImage = {
    props: { visible: true, imgSrc: '' },
    onEditBtn: () => {
      this.editImageProps.props.visible = false;
      this.editMode = false;
    },
  };

  ngOnInit() {
    this.pageName.set('currency.pageName');
    this.getBreadCrumb();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
    if (this.tyepMode() !== 'Add') this.getCurrencyDetails();
  }

  tyepMode() {
    const url = this.router.url;
    if (url.includes('edit')) return 'Edit';
    if (url.includes('view')) return 'View';
    return 'Add';
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        { label: this.languageService.translate('Home'), routerLink: '/dashboard' },
        { label: this.languageService.translate(this.pageName() + '_' + this.tyepMode() + '_crumb') },
      ],
    };
  }

  getCurrencyDetails() {
    this.ApiService.get(`Currencies/${this.currencyID}`).subscribe((res: any) => {
      const d = res?.data ?? res;
      if (d) {
        this.form.patchValue({
          enName: d.enName,
          arName: d.arName,
          code: d.code,
          symbol: d.symbol,
          icon: d.icon ?? '',
          status: d.status,
        });
        this.editImageProps.props.imgSrc = d.image ?? '';
        this.editMode = !!d.image;
      }
    });
  }

  onSubmit() {
    const raw = this.form.value;
    const payload: any = {
      arName: raw.arName ?? '',
      enName: raw.enName ?? '',
      code: raw.code ?? '',
      symbol: raw.symbol ?? '',
      icon: raw.icon || null,
      imageBase64: raw.imageBase64 || null,
      status: raw.status ?? true,
    };
    if (this.tyepMode() === 'Edit') payload.id = Number(this.currencyID);
    if (this.tyepMode() === 'Add') this.addCurrency(payload);
    else this.editCurrency(payload);
  }

  onFileEdit(control: string) {
    this.form.get(control)?.setValue(null);
  }

  addCurrency(payload: any) {
    this.ApiService.post('Currencies', payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) this.router.navigateByUrl('/currency');
    });
  }

  editCurrency(payload: any) {
    this.ApiService.put('Currencies', payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) this.router.navigateByUrl('/currency');
    });
  }

  cancel() {
    const confirmed = this.confirm.formHasValue(this.form);
    if (confirmed) this.showConfirmMessage = !this.showConfirmMessage;
    else this.router.navigateByUrl('/currency');
  }

  onConfirmMessage() {
    this.router.navigateByUrl('/currency');
  }
}
