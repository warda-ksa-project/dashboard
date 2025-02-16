import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, TitleCasePipe } from '@angular/common';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { DatePickerComponent } from "../../../components/time-picker/time-picker.component";
import { ToasterService } from '../../../services/toaster.service';
import { parseISO } from 'date-fns';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';

const global_PageName = 'working_hours.pageName';

@Component({
  selector: 'app-working-hours-details',
  standalone: true,
  imports: [ReactiveFormsModule,TranslatePipe,TitleCasePipe, ButtonModule, NgIf, RouterModule, BreadcrumpComponent, DatePickerComponent],
  templateUrl: './working-hours-details.component.html',
  styleUrl: './working-hours-details.component.scss'
})
export class WorkingHoursDetailsComponent {
  pageName = signal<string>(global_PageName);
  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToasterService);
  selectedLang: any;
  languageService = inject(LanguageService);
  form = new FormGroup({
    startDate: new FormControl(null, {
      validators: [
        Validators.required
      ],
    }),
    endDate: new FormControl(null, {
      validators: [
        Validators.required
      ]
    })
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }

  get workingHoursId() {
    return this.route.snapshot.params['id'];
  }


  ngOnInit() {
    this.pageName.set(global_PageName)
    this.getBreadCrumb()
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
    });
    if (this.tyepMode() !== 'Add')
      this.getWorkingHours();
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

  getWorkingHours() {
    this.ApiService.get(`WorkingTime/GetWorkingTime/${this.workingHoursId}`).subscribe((res: any) => {
      if (res && res.data) {
        const { startDate, endDate, ...otherData } = res.data;

        const startDateObj = parseISO(startDate);
        const endDateObj = parseISO(endDate);

        this.form.patchValue({
          ...otherData,
          startDate: startDateObj,
          endDate: endDateObj,
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValues = this.form.value;

      const payload = {
        ...formValues,
        startDate: this.convertToLocalISOString(formValues.startDate),
        endDate: this.convertToLocalISOString(formValues.endDate),
        workTimeId: this.workingHoursId,
      };

      if (this.tyepMode() === 'Add') {
        this.addWorkingHour(payload);
      } else {
        this.editWorkingHours(payload);
      }
    } else {
      this.toaster.errorToaster('Please Complete All form Feilds');
    }
  }



  addWorkingHour(payload: any) {
    this.ApiService.post('WorkingTime/CreateWorkingTime', payload, { showAlert: true, message: 'Working Hours Added Successfuly' }).subscribe(res => {
      if (res){
        this.toaster.successToaster('Added Successfully');
        this.router.navigateByUrl('working_hours')
      }
    })
  }

  editWorkingHours(payload: any) {
    this.ApiService.put('WorkingTime/UpdateWorkingTime', payload, { showAlert: true, message: 'Working Hours Updated Successfuly' }).subscribe(res => {
      if (res){
        this.toaster.successToaster('Edited Successfully');
        this.router.navigateByUrl('working_hours')
      }
    })
  }


  convertTimeToDate(isoString: string): Date {
    const utcDate = new Date(isoString);
    const hours = utcDate.getUTCHours();
    const minutes = utcDate.getUTCMinutes();

    const localDate = new Date();
    localDate.setHours(hours, minutes, 0, 0);

    return localDate;
  }

  convertToLocalISOString(date: any): string {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const localTime = new Date(date.getTime() - offsetMs);
    return localTime.toISOString().slice(0, -1);
  }
}
