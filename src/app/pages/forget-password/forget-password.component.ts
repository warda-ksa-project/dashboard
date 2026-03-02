import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators , AbstractControl , ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service'; // Import here
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { OtpModalComponent } from '../../components/otp-modal/otp-modal.component';
import { ValidationHandlerPipePipe } from '../../pipes/validation-handler-pipe.pipe';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [NgIf,OtpModalComponent, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule  , RouterModule, ValidationHandlerPipePipe],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  checkMobile: FormGroup;
  changePassword: FormGroup;

  toaster = inject(ToasterService)  ;
  hideCheckForm: boolean = false;
  openOtpModal: boolean = false;



  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.checkMobile = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.maxLength(9)]]
    });

    this.changePassword = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  onSubmit() {
    if (this.checkMobile.valid) {
      const payload = { phone: this.checkMobile.value.mobileNumber };
      this.api.post('Auth/forget-password', payload).subscribe((res: any) => {
        if (res?.isSuccess !== false) {
          this.openOtpModal = true;
        } else {
          this.toaster.errorToaster(res?.error?.message || 'Error');
        }
      });
    } else {
      this.toaster.errorToaster('Please add your mobile number');
    }
  }


  onOtpSubmit() {
    if (this.changePassword.valid) {
      const payload = {
        phone: this.checkMobile.get('mobileNumber')?.value,
        newPassword: this.changePassword.get('password')?.value
      };
      this.api.post('Auth/reset-password', payload).subscribe((data: any) => {
        if (data?.isSuccess !== false) {
          this.toaster.successToaster('Password changed successfully');
          this.router.navigate(['/auth/login']);
        } else {
          this.toaster.errorToaster(data?.error?.message || 'Error');
        }
      });
    } else {
      if (this.changePassword.hasError('passwordsDoNotMatch')) {
        this.toaster.errorToaster('Passwords do not match');
      } else {
        this.toaster.errorToaster('Please complete all fields');
      }
    }
  }

  getOtpValue(e: any) {
    const payload = {
      phone: this.checkMobile.get('mobileNumber')?.value,
      otpCode: e.otpValue
    };
    this.api.post('Auth/verify-forget-password', payload).subscribe((data: any) => {
      if (data?.isSuccess !== false) {
        this.hideCheckForm = true;
        this.openOtpModal = false;
      } else {
        this.toaster.errorToaster(data?.error?.message || 'Otp Is Not Valid');
      }
    });
  }

  resendOtp(_e?: any) {
    this.onSubmit();
  }

}
