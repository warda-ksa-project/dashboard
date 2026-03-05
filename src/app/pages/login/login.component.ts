import { Component, Inject, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DOCUMENT, NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { OtpModalComponent } from '../../components/otp-modal/otp-modal.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { Roles } from '../../conts';
import { ValidationHandlerPipePipe } from '../../pipes/validation-handler-pipe.pipe';
import { SelectComponent } from '../../components/select/select.component';
import { Subject, EMPTY, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap, catchError, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    OtpModalComponent,
    TranslatePipe,
    NgIf,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterModule,
    ValidationHandlerPipePipe,
    SelectComponent,
    SelectModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ApiService],
})
export class LoginComponent {
  loginForm: FormGroup;
  toaster = inject(ToasterService);
  otpValue = '';
  mobileNumber = '';
  openOtpModal = false;
  countries: { name: string; code: number; phoneCode: string; phoneLength: number; imageUrl?: string }[] = [];
  countriesData: any[] = [];
  languageService = inject(LanguageService);
  currentLang = 'en';
  selectedLang = localStorage.getItem('lang') || 'en';
  selectedCountryId: number | null = null;
  selectedCountry: { phoneLength: number; phoneCode: string } | null = null;
  isAdmin: boolean | null = null;
  isCheckingAdmin = false;
  canSubmit = false;
  private destroy$ = new Subject<void>();

  get countryControl(): FormControl {
    return this.loginForm.get('country') as FormControl;
  }

  getSelectedPhoneCountry() {
    const id = this.loginForm.get('country')?.value;
    return this.countries.find((c) => c.code === id) || null;
  }

  onAdminCountryChange(countryId: number) {
    this.selectedCountryId = countryId;
  }

  onCountryChange(countryId: number) {
    const c = this.countriesData.find((x: any) => x.id === countryId);
    this.selectedCountry = c
      ? { phoneLength: this.getPhoneLength(c), phoneCode: c.phoneCode || '+966' }
      : null;
    this.updatePhoneValidators();
    this.isAdmin = null;
  }

  private getPhoneLength(c: any): number {
    const pl = c?.phoneLength;
    if (typeof pl === 'number') return pl;
    if (typeof pl === 'string') return parseInt(pl, 10) || 9;
    return 9;
  }

  private updatePhoneValidators() {
    const ctrl = this.loginForm.get('phoneNumber');
    const len = this.selectedCountry?.phoneLength ?? 9;
    ctrl?.setValidators([
      Validators.required,
      Validators.pattern(/^\d+$/),
      Validators.minLength(len),
      Validators.maxLength(len),
    ]);
    ctrl?.updateValueAndValidity();
  }

  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private api: ApiService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      country: [null, [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      adminCountry: [null, []],
      roleId: [1, []],
    });
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.initAppTranslation();
    this.getAllCountries();
    this.watchPhoneAndCheckAdmin();
    this.watchCanSubmit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private watchCanSubmit() {
    const countryCtrl = this.loginForm.get('country')!;
    const phoneCtrl = this.loginForm.get('phoneNumber')!;
    const adminCountryCtrl = this.loginForm.get('adminCountry')!;
    combineLatest([
      countryCtrl.valueChanges.pipe(startWith(countryCtrl.value)),
      phoneCtrl.valueChanges.pipe(startWith(phoneCtrl.value)),
      adminCountryCtrl.valueChanges.pipe(startWith(adminCountryCtrl.value)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateCanSubmit());
  }

  private updateCanSubmit() {
    const len = this.selectedCountry?.phoneLength ?? 0;
    const phone = (this.loginForm.get('phoneNumber')?.value ?? '').toString().replace(/\D/g, '');
    const hasMinLength = len > 0 && phone.length >= len;
    const adminCountryOk = this.isAdmin !== true || !!this.loginForm.get('adminCountry')?.value;
    this.canSubmit = !!(
      this.loginForm.valid &&
      hasMinLength &&
      this.isAdmin !== null &&
      !this.isCheckingAdmin &&
      adminCountryOk
    );
  }

  private watchPhoneAndCheckAdmin() {
    const phoneControl = this.loginForm.get('phoneNumber');
    const roleIdControl = this.loginForm.get('roleId');
    const countryControl = this.loginForm.get('country');

    const countryCtrl = this.loginForm.get('country')!;
    const phoneCtrl = this.loginForm.get('phoneNumber')!;
    combineLatest([
      countryCtrl.valueChanges.pipe(startWith(countryCtrl.value)),
      phoneCtrl.valueChanges.pipe(startWith(phoneCtrl.value ?? '')),
    ])
      .pipe(
        debounceTime(400),
        map(([countryId, phone]: [unknown, unknown]) => {
          const c = this.countriesData.find((x: any) => x.id === countryId);
          const len = c ? this.getPhoneLength(c) : 0;
          const digits = (phone ?? '').toString().replace(/\D/g, '');
          return { countryId, digits, requiredLen: len };
        }),
        distinctUntilChanged((a, b) => a.digits === b.digits && a.requiredLen === b.requiredLen),
        tap(({ requiredLen, digits }) => {
          if (digits.length < requiredLen) {
            this.isAdmin = null;
            this.isCheckingAdmin = false;
          }
        }),
        filter(({ requiredLen, digits }) => requiredLen > 0 && digits.length >= requiredLen),
        tap(() => (this.isCheckingAdmin = true)),
        switchMap(({ digits }) => {
          return this.api.get<any>('Auth/check-admin', { Phone: digits }).pipe(
            map((res: any) => !!(res?.data ?? res?.result ?? res)),
            catchError((err) => {
              this.isCheckingAdmin = false;
              this.isAdmin = null;
              this.updateCanSubmit();
              const msg = err?.error?.error?.message || err?.error?.message || err?.message;
              if (msg) this.toaster.errorToaster(msg);
              return EMPTY;
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((isAdmin: boolean) => {
        this.isCheckingAdmin = false;
        this.isAdmin = isAdmin;
        if (isAdmin) {
          roleIdControl?.setValue(1);
          this.loginForm.get('adminCountry')?.setValidators([Validators.required]);
          this.loginForm.get('adminCountry')?.setValue(null);
          this.loginForm.get('adminCountry')?.updateValueAndValidity();
          this.selectedCountryId = null;
        } else {
          roleIdControl?.setValue(2);
          this.loginForm.get('adminCountry')?.clearValidators();
          this.loginForm.get('adminCountry')?.updateValueAndValidity();
        }
        this.updateCanSubmit();
      });
  }

  onSubmit() {
    const phoneCtrl = this.loginForm.get('phoneNumber');
    const digits = (phoneCtrl?.value ?? '').toString().replace(/\D/g, '');
    const requiredLen = this.selectedCountry?.phoneLength ?? 0;

    phoneCtrl?.markAsTouched();

    if (!this.selectedCountry) {
      this.toaster.errorToaster(this.translate.instant('login.select_country_first'));
      return;
    }
    if (requiredLen > 0 && digits.length !== requiredLen) {
      this.toaster.errorToaster(
        this.translate.instant('login.phone_length_invalid', { count: requiredLen })
      );
      return;
    }
    if (!this.canSubmit) {
      if (this.isCheckingAdmin) this.toaster.errorToaster(this.translate.instant('login.wait_verification'));
      else if (this.isAdmin === null && digits.length >= requiredLen)
        this.toaster.errorToaster(this.translate.instant('login.wait_verification'));
      else this.toaster.errorToaster(this.translate.instant('login.complete_all_fields'));
      return;
    }
    this.onLogin(this.loginForm.value);
  }

  onFormKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !this.canSubmit) {
      event.preventDefault();
    }
  }

  getAllCountries() {
    this.api.get('Countries').subscribe((res: any) => {
      if (res.data) {
        this.countries = [];
        this.countriesData = res.data;
        const base = environment.baseUrl.replace('/api/', '');
        res.data.forEach((country: any) => {
          this.countries.push({
            name: (this.selectedLang === 'en' ? country.enName : country.arName) + ' (' + (country.phoneCode || '') + ')',
            code: country.id,
            phoneCode: country.phoneCode || '+966',
            phoneLength: this.getPhoneLength(country),
            imageUrl: country.image ? (country.image.startsWith('http') ? country.image : base + (country.image.startsWith('/') ? country.image : '/' + country.image)) : undefined,
          });
        });
        if (this.countries.length && !this.loginForm.get('country')?.value) {
          this.loginForm.patchValue({ country: this.countries[0].code });
          this.onCountryChange(this.countries[0].code);
        }
      }
    });
  }
  getOtpValue(e: any) {
    let otpObject = {
      phone: this.mobileNumber,
      otpCode: e.otpValue,
    };
    this.api.post('Auth/verify-otp', otpObject).subscribe((data: any) => {
      if (data.isFailure) {
        this.toaster.errorToaster(data.error?.message || 'Invalid OTP');
      } else {
        const user = data.data;
        localStorage.setItem('token', user.accessToken);
        localStorage.setItem('userId', user.userId);
        localStorage.setItem('name', user.userName);
        if (user.role === Roles.admin) {
          localStorage.setItem('role', Roles.admin.toString());
        } else {
          localStorage.setItem('role', Roles.trader.toString());
        }
        const adminCountryId = this.loginForm.get('adminCountry')?.value ?? this.selectedCountryId;
        if (adminCountryId) {
          localStorage.setItem('countryId', adminCountryId.toString());
        } else if (user.countryId != null) {
          // Trader: use country from phone (backend derives from phone country code)
          localStorage.setItem('countryId', String(user.countryId));
        } else {
          localStorage.removeItem('countryId');
        }

        if (user.role === Roles.admin)
          this.router.navigate(['/dashboard-admin']);
        else this.router.navigate(['/dashboard-trader']);
      }
    });
  }

  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.currentLang = this.selectedLang;
    this.languageService.change(this.selectedLang);

    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute(
      'dir',
      this.selectedLang === 'ar' ? 'rtl' : 'ltr'
    );
  }

  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }
  onLogin(loginData: any) {
    this.openOtpModal = false;
    const digits = (loginData.phoneNumber ?? '').toString().replace(/\D/g, '');
    this.api.post('Auth/send-otp', { phone: digits }).subscribe({
      next: (res: any) => {
        if (res?.isFailure) {
          const errMsg = res?.error?.message || res?.message || 'Login failed';
          this.toaster.errorToaster(errMsg);
        } else {
          this.mobileNumber = digits;
          this.openOtpModal = true;
        }
      },
      error: (err) => {
        const msg = err?.error?.error?.message || err?.error?.message || err?.message || 'Login failed';
        this.toaster.errorToaster(msg);
      },
    });
  }
  resendOtp(e: any) {
    this.api.post('Auth/send-otp', { phone: this.mobileNumber }).subscribe((res: any) => {
      if (res.isSuccess) {
        this.toaster.successToaster('OTP sent successfully');
      } else {
        this.toaster.errorToaster(res.error?.message || 'Failed to resend OTP');
      }
    });
  }
}
