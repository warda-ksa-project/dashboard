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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-cancel-reason-details',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, ButtonModule, NgIf, DialogComponent, TitleCasePipe, InputTextComponent, RouterModule, BreadcrumpComponent],
  templateUrl: './cancel-reason-details.component.html',
  styleUrl: './cancel-reason-details.component.scss'
})
export class CancelReasonDetailsComponent {
  pageName = signal<string>('');
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  private translateService = inject(TranslateService)

  form = new FormGroup({
    enReason: new FormControl('', [Validators.required, Validations.englishCharsValidator()]),
    arReason: new FormControl('', [Validators.required, Validations.arabicCharsValidator()])
  })

  bredCrumb: IBreadcrumb = {
    crumbs: [
      {
        label: 'Home',
        routerLink: '/dashboard',
      },
      {
        label: this.pageName(),
      },
    ]
  }

  get getID() {
    return this.route.snapshot.params['id']
  }
 selectedLang: any;
  languageService = inject(LanguageService);
  ngOnInit() {
    this.pageName.set('cancel_reason.pageName')
    this.getBreadCrumb()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    }); 
    if (this.tyepMode() !== 'Add')
      this.getCancelReasonsDetails()
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
          label:  this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(this.pageName()+ '_'+this.tyepMode()+'_crumb'),
        },
      ]
    }
  }
  getCancelReasonsDetails() {
    this.ApiService.get(`CancelReasons/${this.getID}`).subscribe((res: any) => {
      const d = res?.data ?? res;
      if (d) this.form.patchValue({ enReason: d.enReason ?? d.enName, arReason: d.arReason ?? d.arName });
    });
  }

  onSubmit() {
    const raw = this.form.value;
    const payload: any = { arReason: raw.arReason ?? '', enReason: raw.enReason ?? '' };
    if (this.tyepMode() === 'Edit') payload.id = Number(this.getID);
    if (this.tyepMode() === 'Add') this.addCancelReason(payload);
    else this.editCancelReason(payload);
  }

  navigateToPageTable() {
    this.router.navigateByUrl('/cancel-reason')
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.navigateToPageTable()

  }

  onConfirmMessage() {
    this.navigateToPageTable()

  }

  addCancelReason(payload: any) {
    this.ApiService.post('CancelReasons', payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) this.navigateToPageTable();
    });
  }

  editCancelReason(payload: any) {
    this.ApiService.put('CancelReasons', payload).subscribe((res: any) => {
      if (res?.isSuccess !== false) this.navigateToPageTable();
    });
  }


}

