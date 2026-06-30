import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FinancialService } from '../../services/financial.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { SelectComponent } from '../../components/select/select.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import { ToasterService } from '../../services/toaster.service';

interface SelectOption {
  name: string;
  code: number;
}

@Component({
  selector: 'app-commission-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    TranslatePipe,
    TitleCasePipe,
    SelectComponent,
    InputTextComponent,
    BreadcrumpComponent,
  ],
  templateUrl: './commission-settings.component.html',
  styleUrl: './commission-settings.component.scss',
})
export class CommissionSettingsComponent implements OnInit {
  private financial = inject(FinancialService);
  private api = inject(ApiService);
  private toast = inject(ToasterService);
  languageService = inject(LanguageService);

  pageName = signal('commission_settings.pageName');
  settings: any[] = [];
  tradersList: SelectOption[] = [];
  categoriesList: SelectOption[] = [];
  selectedLang = 'ar';
  bredCrumb: IBreadcrumb = { crumbs: [] };
  editingId: number | null = null;
  statusList: SelectOption[] = [];

  form = new FormGroup({
    commissionRate: new FormControl(15, {
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
    traderId: new FormControl<number>(0),
    categoryId: new FormControl<number>(0),
    isActive: new FormControl<number>(1),
  });

  ngOnInit() {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe((e) => {
      this.selectedLang = e.lang;
      this.getBreadCrumb();
      this.buildTraderOptions();
      this.buildCategoryOptions();
      this.buildStatusOptions();
    });
    this.buildStatusOptions();
    this.loadLookups();
    this.load();
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        { label: this.languageService.translate('Home'), routerLink: '/dashboard-admin' },
        { label: this.languageService.translate(this.pageName()) },
      ],
    };
  }

  loadLookups() {
    this.api.get('Traders').subscribe((res: any) => {
      const list = res?.data ?? [];
      this.tradersRaw = Array.isArray(list) ? list : [];
      this.buildTraderOptions();
    });
    this.api.get('Categories').subscribe((res: any) => {
      const main = res?.data ?? [];
      this.categoriesRaw = (Array.isArray(main) ? main : []).map((c: any) => ({
        ...c,
        _type: 'main' as const,
      }));
      this.api.get('SubCategories').subscribe((subRes: any) => {
        const sub = subRes?.data ?? [];
        this.categoriesRaw = [
          ...this.categoriesRaw,
          ...(Array.isArray(sub) ? sub : []).map((c: any) => ({
            ...c,
            _type: 'sub' as const,
          })),
        ];
        this.buildCategoryOptions();
      });
    });
  }

  private tradersRaw: any[] = [];
  private categoriesRaw: any[] = [];

  private buildTraderOptions() {
    const allLabel =
      this.selectedLang === 'ar' ? 'الكل (نسبة عامة)' : 'All (default rate)';
    this.tradersList = [
      { name: allLabel, code: 0 },
      ...this.tradersRaw.map((t) => ({
        name:
          this.selectedLang === 'ar'
            ? t.storeName ?? t.arName ?? t.userName ?? `#${t.id}`
            : t.storeName ?? t.enName ?? t.userName ?? `#${t.id}`,
        code: t.id ?? t.userId,
      })),
    ];
  }

  private buildCategoryOptions() {
    const allLabel =
      this.selectedLang === 'ar' ? 'الكل (نسبة عامة)' : 'All (default rate)';
    this.categoriesList = [
      { name: allLabel, code: 0 },
      ...this.categoriesRaw.map((c) => {
        const name =
          this.selectedLang === 'ar'
            ? c.arName ?? c.enName ?? c.name?.ar
            : c.enName ?? c.arName ?? c.name?.en;
        const prefix =
          c._type === 'sub'
            ? this.selectedLang === 'ar'
              ? 'فرعي: '
              : 'Sub: '
            : this.selectedLang === 'ar'
              ? 'رئيسي: '
              : 'Main: ';
        return { name: `${prefix}${name ?? c.id}`, code: c.id };
      }),
    ];
  }

  private buildStatusOptions() {
    this.statusList = [
      {
        name: this.languageService.translate('commission_settings.active'),
        code: 1,
      },
      {
        name: this.languageService.translate('commission_settings.inactive'),
        code: 0,
      },
    ];
  }

  load() {
    this.financial.getCommissionSettings().subscribe((res: any) => {
      this.settings = res?.data ?? res ?? [];
    });
  }

  onSubmit() {
    if (this.editingId) {
      this.update();
    } else {
      this.add();
    }
  }

  add() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.financial
      .createCommissionSetting({
        commissionRate: Number(v.commissionRate),
        traderId: v.traderId && v.traderId > 0 ? v.traderId : undefined,
        categoryId: v.categoryId && v.categoryId > 0 ? v.categoryId : undefined,
      })
      .subscribe({
        next: (res: any) => {
          if (res?.isFailure || res?.isSuccess === false) {
            this.toast.errorToaster(
              res?.error?.message ||
                this.languageService.translate('commission_settings.save_failed'),
            );
            return;
          }
          this.toast.successToaster(
            this.languageService.translate('commission_settings.save_success'),
          );
          this.resetForm();
          this.load();
        },
        error: () => {
          this.toast.errorToaster(
            this.languageService.translate('commission_settings.save_failed'),
          );
        },
      });
  }

  update() {
    if (!this.editingId || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.financial
      .updateCommissionSetting({
        id: this.editingId,
        commissionRate: Number(v.commissionRate),
        isActive: Number(v.isActive) === 1,
      })
      .subscribe({
        next: (res: any) => {
          if (res?.isFailure || res?.isSuccess === false) {
            this.toast.errorToaster(
              res?.error?.message ||
                this.languageService.translate('commission_settings.update_failed'),
            );
            return;
          }
          this.toast.successToaster(
            this.languageService.translate('commission_settings.update_success'),
          );
          this.resetForm();
          this.load();
        },
        error: () => {
          this.toast.errorToaster(
            this.languageService.translate('commission_settings.update_failed'),
          );
        },
      });
  }

  startEdit(setting: any) {
    this.editingId = setting.id;
    this.form.patchValue({
      commissionRate: setting.commissionRate,
      traderId: setting.traderId ?? 0,
      categoryId: setting.categoryId ?? 0,
      isActive: setting.isActive ? 1 : 0,
    });
    this.form.get('traderId')?.disable();
    this.form.get('categoryId')?.disable();
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.editingId = null;
    this.form.reset({
      commissionRate: 15,
      traderId: 0,
      categoryId: 0,
      isActive: 1,
    });
    this.form.get('traderId')?.enable();
    this.form.get('categoryId')?.enable();
  }

  traderName(id: number | null | undefined): string {
    if (!id) return this.languageService.translate('commission_settings.all');
    const t = this.tradersRaw.find((x) => (x.id ?? x.userId) === id);
    if (!t) return `#${id}`;
    return this.selectedLang === 'ar'
      ? t.storeName ?? t.arName ?? t.userName
      : t.storeName ?? t.enName ?? t.userName;
  }

  categoryName(id: number | null | undefined): string {
    if (!id) return this.languageService.translate('commission_settings.all');
    const c = this.categoriesRaw.find((x) => x.id === id);
    if (!c) return `#${id}`;
    const name =
      this.selectedLang === 'ar'
        ? c.arName ?? c.enName ?? c.name?.ar
        : c.enName ?? c.arName ?? c.name?.en;
    return name ?? `#${id}`;
  }

  activeLabel(isActive: boolean): string {
    return this.languageService.translate(
      isActive ? 'commission_settings.active' : 'commission_settings.inactive',
    );
  }

  remove(setting: { id: number }) {
    const msg = this.languageService.translate('commission_settings.delete_confirm');
    if (!confirm(msg)) return;

    this.financial.deleteCommissionSetting(setting.id).subscribe({
      next: (res: any) => {
        if (res?.isFailure || res?.isSuccess === false) {
          this.toast.errorToaster(
            res?.error?.message ||
              this.languageService.translate('commission_settings.delete_failed'),
          );
          return;
        }
        if (this.editingId === setting.id) {
          this.resetForm();
        }
        this.toast.successToaster(
          this.languageService.translate('commission_settings.delete_success'),
        );
        this.load();
      },
      error: () => {
        this.toast.errorToaster(
          this.languageService.translate('commission_settings.delete_failed'),
        );
      },
    });
  }
}
