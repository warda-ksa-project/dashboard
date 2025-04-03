
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Roles } from '../../conts';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [OtpModalComponent, TranslatePipe, NgIf, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ApiService]
})

export class LoginComponent {


  loginForm: FormGroup;
  toaster = inject(ToasterService);
  otpValue: string = '';
  mobileNumber: string = '';
  openOtpModal: boolean = false;
  languageService = inject(LanguageService);
  currentLang = 'en';
  selectedLang: string = localStorage.getItem('lang') || 'en';



  constructor(private fb: FormBuilder,@Inject(DOCUMENT) private document: Document, private api: ApiService, private translate: TranslateService, private router: Router) {
    this.loginForm = this.fb.group({
      mobile: ['565664343', [Validators.required]],
      password: ['Admin@VL', [Validators.required]],
      // mobile: ['508991360', [Validators.required]],
      // password: ['omar1234', [Validators.required]]
    });

    this.translate.setDefaultLang('en');
    this.translate.use('en');  // You can change this dynamically
  }

  ngOnInit(): void {
    this.initAppTranslation();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.onLogin(this.loginForm.value);
    } else {
      this.toaster.errorToaster('Please Complete All Feilds');
    }
  }

  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.currentLang = this.selectedLang;
    this.languageService.change(this.selectedLang);

    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');
  }



  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }

  onLogin(loginfrom: any) {
    this.api.login(loginfrom).subscribe((res: any) => {
      this.mobileNumber = res.data.phone;
      // this.openOtpModal = res.data.status;
      if (!res.data.token) {
        localStorage.removeItem('token');
        // localStorage.removeItem('role');
        this.toaster.errorToaster(res.message)
      } else {
        // localStorage.setItem('userData', JSON.stringify(dataUser))
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId',res.data.id)
        localStorage.setItem('img',res.data.image)
        localStorage.setItem('name',res.data.name)
        localStorage.setItem('email',res.data.email)
        // localStorage.setItem('role',res.data.role)
        if(res.data.role==Roles.admin)
        this.router.navigate(['/dashboard-admin']);
      else
      this.router.navigate(['/dashboard-trader']);

      }
    })
  }

  // getOtpValue(e: any) {
  //   let otpObject = {
  //     "mobile": this.mobileNumber,
  //     "otpCode": e.otpValue
  //   }
  //   this.api.post('Authentication/VerfiyOtp', otpObject).subscribe((data: any) => {
  //     console.log(data.data);
  //     if (data.message == 'Otp Is Not Valid') {
  //       this.toaster.errorToaster(data.message)
  //     } else {
  //       let dataUser: any = {
  //         img: data.data.imgSrc,
  //         id: data.data.userId,
  //         gender: data.data.gender
  //       }
  //     }
  //   })
  // }

  resendOtp(e: any) {
    this.onSubmit();
  }

}
