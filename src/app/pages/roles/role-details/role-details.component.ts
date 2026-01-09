import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Validations } from '../../../validations';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { BreadcrumpComponent } from "../../../components/breadcrump/breadcrump.component";
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { ConfirmMsgService } from '../../../services/confirm-msg.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { UploadFileComponent } from "../../../components/upload-file/upload-file.component";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Checkbox } from 'primeng/checkbox';
import { TranslatePipe } from '@ngx-translate/core';
import { CheckBoxComponent } from "../../../components/check-box/check-box.component";
import { LanguageService } from '../../../services/language.service';



const global_PageName='roles.pageName';
const global_API_deialis='Role'+'/GetById';
const global_API_create='Role'+'/Create';
const global_API_update='Role'+'/Update';
const global_routeUrl ='/settings/roles'
@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, ToggleSwitchModule, NgFor, Checkbox, FormsModule, TitleCasePipe, ButtonModule, NgIf, DialogComponent, InputTextComponent, EditorComponent, RouterModule, BreadcrumpComponent, UploadFileComponent, CheckBoxComponent],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss'
})
export class RoleDetailsComponent {

  pageName =signal<string>(global_PageName);
  private ApiService = inject(ApiService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  showConfirmMessage: boolean = false
  private confirm = inject(ConfirmMsgService)
  rolesList:any[]=[]
  selectedRoles:any=[]
  convertSelectedRoles:any=[]
  form = new FormGroup({
    enName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.englishCharsValidator('faqs.validation_english_title'),
      ],
    }),
    arName: new FormControl('', {
      validators: [
        Validators.required,
        Validations.arabicCharsValidator('isArabic')
      ]
    }),
    roleId:new FormControl(this.getID|0),
    accessList: new FormControl('string'),
  })

  bredCrumb: IBreadcrumb = {
    crumbs: []
  }
  checkToggle: boolean = true;

  get getID() {
    return this.route.snapshot.params['id']
  }

  selectedLang: any;
  languageService = inject(LanguageService);
  
  ngOnInit() {
    this.getAllControllersActions()
    this.pageName.set(global_PageName)
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getBreadCrumb();
      this.getAllControllersActions()

    });
    if (this.tyepMode() !== 'Add')
      this.API_getItemDetails()
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
  onToggle(checked:boolean,controller:any,action:any,index:number){
    if(checked){
           this.selectedRoles.push({
               id:index,
               controller:controller,
               actions:[action]
           })

           this.convertSelectedRoles.push({
            id:index,
            controller:controller,
            actions:[{name:action,checked:true}]
        })

    }else{
      this.selectedRoles =this.selectedRoles.filter((item:any) => item.actions[0] !== action);
      this.convertSelectedRoles =this.convertSelectedRoles.filter((item:any) => item.actions[0].name !== action);

    }


  }
  API_getItemDetails() {
    this.ApiService.get(`${global_API_deialis}/${this.getID}`).subscribe((res: any) => {
      if (res)
        this.form.patchValue({
          accessList:res.data.accessList,
          roleId:res.data.roleId,
          arName:res.data.arName,
          enName:res.data.enName,

        })
        this.updateCheckedStatus(res.data.controllerInfo,this.rolesList)
    })
  }
  updateCheckedStatus(rolesFromDetails:any[], rolesList:any[]) {
    rolesList.forEach(controllerObj => {
        const firstController = rolesFromDetails.find(controller => controller.controller === controllerObj.controller);
      
        if (firstController) {
            controllerObj.actions.forEach((action:any) => {
                if (firstController.actions.includes(action.name)) {
                    action.checked = true;
                }
            });
        }
    });
      this.convertSelectedRoles =this.filterCheckedActions(rolesList)
    return rolesList

}

filterCheckedActions(array:any) {
  let result:any = [];

  array.forEach((item:any, index:number) => {
      item.actions.forEach((action:any) => {
          if (action.checked) {
              result.push({
                  id: index,
                  controller: item.controller,
                  actions: [action]
              });
          }
      });
  });

  return result;
}

  getAllControllersActions(){
    this.ApiService.get('Role/controllers-actions').subscribe((res:any) => {
      this.rolesList=[]
      if(res){
        
        res.map((role:any,index:number)=>{
          let action:any =[]
           role.actions.map((ac:string)=>{
                action.push({
                  name:ac,
                  checked:false
                })
              
           })
            this.rolesList[index]={
            actions:action,
            controller:role.controller
           }
        })
        
      }
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
      controllerInfo:this.tyepMode() == 'Add'?this.setRolesToSubmit(this.selectedRoles):this.simplifyActions(this.setRolesToSubmit(this.convertSelectedRoles))
    }

    if (this.tyepMode() == 'Add')
      this.API_forAddItem(payload)
    else
      this.API_forEditItem(payload)

   }

   setRolesToSubmit(arraySelected:any){
   const transformed:any = Object.values(
      (arraySelected as any[]).reduce((acc:any, { controller, actions }) => {
          if (!acc[controller]) {
              acc[controller] = { controller, actions: [] };
          }
          acc[controller].actions = [...new Set([...acc[controller].actions, ...actions])];
          return acc;
      }, {})
  );

    return transformed
   }

  simplifyActions(data:any[]) {
    return data.map(item => ({
        id: item.id,
        controller: item.controller,
        actions: item.actions.map((action:any) => action.name) 
    }));
}
  navigateToPageTable(){
    this.router.navigateByUrl(global_routeUrl)
  }

  cancel() {
    const hasValue = this.confirm.formHasValue(this.form)
    if (hasValue && this.tyepMode()=='Edit')
      this.showConfirmMessage = !this.showConfirmMessage
    else
      this.navigateToPageTable()

  }

  onConfirmMessage() {
    this.navigateToPageTable()

  }


  API_forAddItem(payload: any) {

    this.ApiService.post(global_API_create, payload).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }

  API_forEditItem(payload: any) {

    this.ApiService.put(global_API_update, payload).subscribe(res => {
      if (res)
        this.navigateToPageTable()
    })
  }


}
