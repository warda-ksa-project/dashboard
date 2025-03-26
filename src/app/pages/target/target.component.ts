import { Component, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { Validations } from '../../validations';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../services/confirm-msg.service';
import { DialogComponent } from '../../components/dialog/dialog.component';

const global_PageName = 'target.pageName';
const global_routeUrl = '/dashboard-trader'
const global_API_getAll = 'target' + '/GetAll';
const global_API_update = 'target' + '/Update';

@Component({
  selector: 'app-target',
  standalone: true,
  imports: [BreadcrumpComponent,NgFor,DialogComponent,TranslatePipe,TitleCasePipe, ReactiveFormsModule,ToastModule, ButtonModule ,NgIf,InputTextComponent],
  templateUrl: './target.component.html',
  styleUrl: './target.component.scss'
})
export class TargetComponent {
 pageName = signal<string>('');
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private translateService= inject(TranslateService)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)

  selectedLang: any;
  languageService = inject(LanguageService);
  months:any[] =[]
  form = new FormGroup({
    jan: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    feb: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    mar: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    abr: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    may: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    jun: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    jul: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    aug: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    sep: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    oct: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    nov: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    dec: new FormControl(0,{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }



  ngOnInit() {
    this.pageName.set(global_PageName)
    this.API_getAll()
    this.getBreadCrumb()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.months=[
      {
        id:0,
        month:this.selectedLang=='en'?'January':'يناير',
        control:'jan',
        target:''
      },
      {
        id:1,
        month:this.selectedLang=='en'? 'February':'فبراير', 
        control:'feb',
        target:''
      },
      {
        id:2,
        month: this.selectedLang=='en'? 'March':'مارس', 
        control:'mar',
        target:''
      },
      {
        id:3,
        month:this.selectedLang=='en'?'April':'ابريل',
        control:'abr',
        target:''
      },
      {
        id:4,
        month:this.selectedLang=='en'?'May':'مايو',
        control:'may',
        target:''
      },
      {
        id:5,
        month:this.selectedLang=='en'?'June':'يونيو', 
        control:'jun',
        target:''
      },
      {
        id:6,
        month:this.selectedLang=='en'?'July':'يوليو',
        control:'jul',
        target:''
      },
      {
        id:7,
        month:this.selectedLang=='en'?'August':'اغسطس',
        control:'aug',
        target:''
      },
      {
        id:8,
        month:this.selectedLang=='en'?'September':'سبتمبر',
        control:'sep',
        target:''
      },
      {
        id:9,
        month: this.selectedLang=='en'?'October':'اكتوبر',
        control:'oct',
        target:''
      },
      {
        id:10,
        month: this.selectedLang=='en'?'November':'نوفمبر',

        control:'nov',
        target:''
      },
      {
        id:11,
        month:this.selectedLang=='en'?'December':'ديسمبر',
        control:'dec',
        target:''
      },
      ]
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb()
      this.API_getAll()
    })
  
  }

tyepMode() {
  // const url = this.router.url;
  let result = 'Edit'
  // if (url.includes('edit')) result = 'Edit'
  // else if (url.includes('view')) result = 'View'
  // else result = 'Add'
  return result
}
getBreadCrumb() {
  this.bredCrumb = {
    crumbs: [
      {
        label:  this.languageService.translate('Home'),
        routerLink: '/dashboard-trader',
      },
      {
        label: this.languageService.translate(this.pageName()+ '_'+this.tyepMode()+'_crumb'),
      },
    ]
  }
}

  API_getAll() {
    this.ApiService.get(`${global_API_getAll}`).subscribe((res: any) => {
      if (res.data) {
          this.form.patchValue({
           jan:res.data[0].target,
           feb:res.data[1].target,
           mar:res.data[2].target,
           abr:res.data[3].target,
           may:res.data[4].target,
           jun:res.data[5].target,
           jul:res.data[6].target,
           aug:res.data[7].target,
           sep:res.data[8].target,
           oct:res.data[9].target,
           nov:res.data[10].target,
           dec:res.data[11].target
         
        })
        
      }
    })
  }
 
  onSubmit() {
   let payload=[
    {
      id: 1,
      month: 0,
      target: this.form.value.jan
    },
    {
      id: 2,
      month: 1,
      target: this.form.value.feb
    },
    {
      id: 3,
      month: 2,
      target: this.form.value.mar
    },
    {
      id: 4,
      month: 3,
      target: this.form.value.abr
    },
    {
      id: 5,
      month: 4,
      target: this.form.value.may
    },
    {
      id:6,
      month:5,
      target: this.form.value.jun
    },
    {
      id:7,
      month:6,
      target: this.form.value.jul
    },
    {
      id: 8,
      month: 7,
      target: this.form.value.aug
    },
    {
      id:9,
      month:8,
      target: this.form.value.sep
    },
    {
      id: 10,
      month: 9,
      target: this.form.value.oct
    },
    {
      id: 11,
      month: 10,
      target: this.form.value.nov
    },
    {
      id: 12,
      month: 11,
      target: this.form.value.dec
    }

    
  ]
    if (this.tyepMode() == 'Add') {

      this.API_forAddItem(payload)

    }
    else {
      this.API_forEditItem(payload)
    }

  }

  
    API_forAddItem(payload: any) {
      this.ApiService.post('', payload, { showAlert: true, message: `Add ${this.pageName()} Successfuly` }).subscribe(res => {
        if (res)
          this.navigateToPageTable()
      })
    }
  
    API_forEditItem(payload: any) {
      this.ApiService.put(global_API_update, payload, { showAlert: true, message: `update ${this.pageName()} Successfuly` }).subscribe(res => {
        if (res)
          this.navigateToPageTable()
      })
    }
  
    navigateToPageTable() {
      this.router.navigateByUrl(global_routeUrl)
    }


  cancel(){
    const hasValue = this.confirm.formHasValue(this.form)
    console.log("TargetComponent  cancel  hasValue:", hasValue)
    if (hasValue)
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.navigateToPageTable()
  }
  onConfirmMessage(){
    this.router.navigateByUrl(global_routeUrl)
  }

 
}
