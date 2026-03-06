import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import { NgFor, NgIf } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../services/confirm-msg.service';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { CheckBoxComponent } from '../../components/check-box/check-box.component';
import { SelectComponent } from '../../components/select/select.component';
import { Roles } from '../../conts';

const global_PageName = 'storeWorkingHours.pageName';
const global_API = 'StoreWorkingHours';
const DAYS = [
  { dayOfWeek: 0, en: 'Sunday', ar: 'الأحد' },
  { dayOfWeek: 1, en: 'Monday', ar: 'الاثنين' },
  { dayOfWeek: 2, en: 'Tuesday', ar: 'الثلاثاء' },
  { dayOfWeek: 3, en: 'Wednesday', ar: 'الأربعاء' },
  { dayOfWeek: 4, en: 'Thursday', ar: 'الخميس' },
  { dayOfWeek: 5, en: 'Friday', ar: 'الجمعة' },
  { dayOfWeek: 6, en: 'Saturday', ar: 'السبت' },
];

@Component({
  selector: 'app-store-working-hours',
  standalone: true,
  imports: [
    BreadcrumpComponent,
    NgFor,
    NgIf,
    DialogComponent,
    TranslatePipe,
    TitleCasePipe,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    CheckBoxComponent,
    SelectComponent,
  ],
  templateUrl: './store-working-hours.component.html',
  styleUrl: './store-working-hours.component.scss',
})
export class StoreWorkingHoursComponent {
  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService);
  private router = inject(Router);
  private confirm = inject(ConfirmMsgService);
  languageService = inject(LanguageService);

  selectedLang: string = 'en';
  showConfirmMessage = false;
  isAdmin = false;
  traderId: number | null = null;
  tradersList: { name: string; code: number }[] = [];
  daysConfig = DAYS;

  form = new FormGroup({
    traderId: new FormControl<number | null>(null, Validators.required),
    days: new FormArray(
      DAYS.map(
        (d) =>
          new FormGroup({
            dayOfWeek: new FormControl(d.dayOfWeek),
            isOpen: new FormControl(false),
            openTime: new FormControl('09:00', Validators.required),
            closeTime: new FormControl('18:00', Validators.required),
          })
      )
    ),
  });

  bredCrumb: IBreadcrumb = { crumbs: [] };

  get daysArray(): FormArray {
    return this.form.get('days') as FormArray;
  }

  ngOnInit() {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.isAdmin = localStorage.getItem('role') === Roles.admin;
    const userId = Number(localStorage.getItem('userId')) || 0;

    if (this.isAdmin) {
      this.loadTraders();
      this.form.get('traderId')?.setValidators(Validators.required);
    } else {
      this.traderId = userId;
      this.form.patchValue({ traderId: userId });
      this.form.get('traderId')?.clearValidators();
      this.form.get('traderId')?.updateValueAndValidity();
      this.loadWorkingHours();
    }

    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
  }

  loadTraders() {
    this.ApiService.get('Traders').subscribe((res: any) => {
      const list = res?.data ?? [];
      this.tradersList = (Array.isArray(list) ? list : []).map((t: any) => ({
        name: this.selectedLang === 'ar' ? (t.storeNameAr ?? t.storeName ?? t.userName) : (t.storeName ?? t.storeNameEn ?? t.userName),
        code: t.id ?? t.userId,
      }));
    });
  }

  onTraderChange(traderId: number) {
    this.traderId = traderId;
    this.loadWorkingHours();
  }

  loadWorkingHours() {
    const tid = this.traderId ?? this.form.get('traderId')?.value;
    if (!tid) return;

    this.ApiService.get(`${global_API}/${tid}`).subscribe((res: any) => {
      const list = res?.data ?? [];
      if (Array.isArray(list) && list.length > 0) {
        this.daysArray.controls.forEach((ctrl, i) => {
          const dayOfWeek = DAYS[i].dayOfWeek;
          const match = list.find((w: any) => w.dayOfWeek === dayOfWeek);
          if (match) {
            ctrl.patchValue({
              isOpen: match.isOpen ?? false,
              openTime: this.toTimeForInput(match.openTime),
              closeTime: this.toTimeForInput(match.closeTime),
            });
          }
        });
      }
    });
  }

  /** Convert API time (HH:mm:ss) to input value (HH:mm) */
  private toTimeForInput(v: any): string {
    if (!v) return '09:00';
    if (typeof v === 'string') return v.length >= 5 ? v.substring(0, 5) : '09:00';
    return '09:00';
  }

  getBreadCrumb() {
    const homeRoute = this.isAdmin ? '/dashboard-admin' : '/dashboard-trader';
    this.bredCrumb = {
      crumbs: [
        { label: this.languageService.translate('Home'), routerLink: homeRoute },
        { label: this.languageService.translate(this.pageName()), routerLink: '' },
      ],
    };
  }

  getDayName(day: { en: string; ar: string }) {
    return this.selectedLang === 'ar' ? day.ar : day.en;
  }

  onSubmit() {
    const tid = this.traderId ?? this.form.get('traderId')?.value;
    if (!tid) return;

    const workingHours = this.daysArray.controls.map((ctrl) => {
      const v = ctrl.value;
      return {
        dayOfWeek: v.dayOfWeek,
        isOpen: v.isOpen ?? false,
        openTime: this.ensureTimeFormat(v.openTime),
        closeTime: this.ensureTimeFormat(v.closeTime),
      };
    });

    this.ApiService.post(global_API, { traderId: tid, workingHours }).subscribe((res: any) => {
      if (res?.isSuccess !== false) {
        this.navigateBack();
      }
    });
  }

  /** Convert input time (HH:mm) to API format (HH:mm:ss) */
  private ensureTimeFormat(t: string): string {
    if (!t) return '09:00:00';
    return t.length === 5 ? t + ':00' : t;
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form);
    if (hasValue) this.showConfirmMessage = true;
    else this.navigateBack();
  }

  onConfirmMessage() {
    this.navigateBack();
  }

  navigateBack() {
    this.router.navigate([this.isAdmin ? '/dashboard-admin' : '/dashboard-trader']);
  }
}
