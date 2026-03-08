import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputOtp } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { IDialog } from '../modal/modal.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-otp-modal',
  standalone: true,
  imports: [ModalComponent,TranslatePipe, FormsModule, InputTextModule, PasswordModule, ButtonModule, InputOtp, NgIf],
  templateUrl: './otp-modal.component.html',
  styleUrls: ['./otp-modal.component.scss']
})
export class OtpModalComponent implements AfterViewInit {
  toaster = inject(ToasterService);
  otp: any;
  timer: number = 60;
  @Input() mobileNumber: string = '';
  @Output() otpValue = new EventEmitter();
  @Output() resendOtp = new EventEmitter()

  dialogProps: IDialog = {
    props: {
      visible: true,
      focusOnShow: false
    },
    onHide: (e?: Event) => { },
    onShow: (e?: Event) => { this.focusFirstOtpInput(); }
  };

  interval: any;

  constructor() { }

  ngOnInit(): void {
    this.mobileNumber = this.addStarsIntoMobileNumber(this.mobileNumber);
    this.startTimer();
  }

  ngAfterViewInit(): void {
    this.focusFirstOtpInput();
  }

  addStarsIntoMobileNumber(mobileNumber: string): string {
    if (!mobileNumber || mobileNumber.length < 3) {
      return mobileNumber;
    }
    return `**${mobileNumber.slice(2)}`;
  }

  startTimer(): void {
    this.clearTimer();
    this.timer = 60;
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getFormattedTimer(): string {
    const minutes = Math.floor(this.timer / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.timer % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  resend(): void {
    this.startTimer();
    this.resendOtp.emit(true);
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  focusFirstOtpInput(): void {
    const tryFocus = (attempt: number = 0) => {
      const maxAttempts = 12;
      const delay = 200 + attempt * 150;
      setTimeout(() => {
        const firstInput = document.getElementById('otp-input-0') || document.querySelector<HTMLInputElement>('.custom-otp-input');
        if (firstInput) {
          firstInput.focus();
        } else if (attempt < maxAttempts) {
          tryFocus(attempt + 1);
        }
      }, delay);
    };
    tryFocus(0);
  }

  checkOtpValue(e: any) {
    console.log(e.value);
    if(e.value.length ==4) {
      this.otpValue.emit({ otpValue: e.value })
    }
  }
}
