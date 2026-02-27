import { Component, Inject, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DOCUMENT, NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service'; // Import here
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { OtpModalComponent } from '../../components/otp-modal/otp-modal.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { RoleId, Roles } from '../../conts';
import { ValidationHandlerPipePipe } from '../../pipes/validation-handler-pipe.pipe';
import { Validations } from '../../validations';
import { SelectComponent } from '../../components/select/select.component';
import { Subject, EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap, catchError } from 'rxjs/operators';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ApiService],
})
export class LoginComponent {
  loginForm: FormGroup;
  toaster = inject(ToasterService);
  otpValue: string = '';
  mobileNumber: string = '';
  openOtpModal: boolean = false;
  countries: any = [];
  countriesData: any[] = []; // Store full country data with phoneLength
  languageService = inject(LanguageService);
  currentLang = 'en';
  selectedLang: string = localStorage.getItem('lang') || 'en';
  selectedCountryId: number | null = null;
  isAdmin: boolean | null = null;
  isCheckingAdmin: boolean = false;
  private destroy$ = new Subject<void>();
  
  // Minimum phone length required before checking admin (most countries have 9+ digits)
  private readonly MIN_PHONE_LENGTH = 9;
  onCountryChange(countryId: number) {
    this.selectedCountryId = countryId;
  }
  
  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private api: ApiService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userName: [
        '',
        [
          Validators.required,
        ],
      ],
      roleId: [1, []],    
      country : [null, []],
    });

    this.translate.setDefaultLang('en');
    this.translate.use('en'); // You can change this dynamically
  }
  
  ngOnInit(): void {
    this.initAppTranslation();
    this.getAllCountries();
    this.watchPhoneAndCheckAdmin();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private watchPhoneAndCheckAdmin() {
    const userNameControl = this.loginForm.get('userName');
    const roleIdControl = this.loginForm.get('roleId');
    const countryControl = this.loginForm.get('country');

    userNameControl?.valueChanges
      .pipe(
        debounceTime(500),
        map((v) => (v ?? '').toString().trim()),
        distinctUntilChanged(),
        tap((phone) => {
          // Reset admin state if phone length is less than minimum
          if (phone.length < this.MIN_PHONE_LENGTH) {
            this.isAdmin = null;
            this.isCheckingAdmin = false;
          }
        }),
        // Only check when phone length reaches minimum threshold
        filter((phone) => phone.length >= this.MIN_PHONE_LENGTH),
        tap(() => {
          this.isCheckingAdmin = true;
        }),
        switchMap((phone) =>
          this.api.get<any>('Auth/check-admin', { Phone: phone }).pipe(
            map((res: any) => res.data),
            catchError(() => {
              this.isCheckingAdmin = false;
              this.isAdmin = null;
              return EMPTY;
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((isAdmin: boolean) => {
        this.isCheckingAdmin = false;
        this.isAdmin = isAdmin;

        if (isAdmin) {
          roleIdControl?.setValue(1);
          countryControl?.setValidators([Validators.required]);
          countryControl?.setValue(null);
          countryControl?.updateValueAndValidity();
          this.selectedCountryId = null;
        } else {
          roleIdControl?.setValue(2);
          countryControl?.clearValidators();
          countryControl?.updateValueAndValidity();
        }
      });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.onLogin(this.loginForm.value);
    } else {
      this.toaster.errorToaster('Please Complete All Feilds');
    }
  }
  getAllCountries() {
    this.api.get('Countries').subscribe((res: any) => {
      if (res.data) {
        this.countries = [];
        this.countriesData = res.data; // Store full country data
        res.data.map((country: any) => {
          this.countries.push({
            name: this.selectedLang == 'en' ? country.enName : country.arName,
            code: country.id,
            phoneLength: country.phoneLength, // Include phoneLength for reference
          });
        });
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
        if (this.selectedCountryId) {
          localStorage.setItem('countryId', this.selectedCountryId.toString());
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
  onLogin(loginfrom: any) {
    this.openOtpModal = false;
    this.api.post('Auth/send-otp', { phone: loginfrom.userName }).subscribe((res: any) => {
      if (res.isSuccess) {
        this.mobileNumber = loginfrom.userName;
        this.openOtpModal = true;
      } else {
        localStorage.removeItem('token');
        this.toaster.errorToaster(res.error?.message || 'Login failed');
      }
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
