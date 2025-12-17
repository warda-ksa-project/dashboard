
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
import { ValidationHandlerPipePipe } from '../../pipes/validation-handler-pipe.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [OtpModalComponent, TranslatePipe, NgIf, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, RouterModule, ValidationHandlerPipePipe],
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
      userName: ['', [Validators.required]],
      roleId : [1, []],
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
  getOtpValue(e: any) {
    let otpObject = {
      "mobile": this.mobileNumber,
      "otpCode": e.otpValue
    }
    this.api.post('Auth/VerfiyOtp', otpObject).subscribe((data: any) => {
      console.log(data.data);
      if (data.message == 'Otp Is Not Valid') {
        this.toaster.errorToaster(data.message)
      } else {
        let dataUser: any = {
          img: data.data.imgSrc,
          id: data.data.userId,
          gender: data.data.gender
        }
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userId', data.data.userId);
        localStorage.setItem('img', data.data.imgSrc);
        localStorage.setItem('name', data.data.name);
        localStorage.setItem('email', data.data.email);
        localStorage.setItem('roleId', data.data.roleId);

        if(data.data.roleId == Roles.admin)
        this.router.navigate(['/dashboard-admin']);
        else
        this.router.navigate(['/dashboard-trader']);
      }
    })
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
    this.openOtpModal = false;
    this.api.login(loginfrom).subscribe((res: any) => {
      this.mobileNumber = res.mobilePhone;
      this.openOtpModal = res.status;
      if (!res.status) {
        localStorage.removeItem('token');
        this.toaster.errorToaster(res.message)
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
