import { Component, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { EditorComponent } from '../../../components/editor/editor.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';
import { Validations } from '../../../validations';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';

interface ISocialMedia {
  whatsAppNumber:string,
  instagramLink:string,
  tikTokLink:string,
  faceBookLink:string,
  youTubeLink:string,
  arBasicInstructions:string,
  enBasicInstructions:string,
  settingId:number,
}
@Component({
  selector: 'app-social-media-update',
  standalone: true,
  imports: [InputTextComponent,TranslatePipe,TitleCasePipe,EditorComponent,ReactiveFormsModule],
  templateUrl: './social-media-update.component.html',
  styleUrl: './social-media-update.component.scss'
})
export class SocialMediaUpdateComponent {
  data:ISocialMedia={
    whatsAppNumber:'',
    instagramLink:'',
    tikTokLink:'',
    faceBookLink:'',
    youTubeLink:'',
    arBasicInstructions:'',
    enBasicInstructions:'',
    settingId:0,
  }
  showConfirmMessage:boolean=false
  form:FormGroup=new FormGroup({
    whatsAppNumber:new FormControl('',{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    instagramLink:new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    tikTokLink:new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    faceBookLink:new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    youTubeLink:new FormControl('',{
      validators: [
        Validators.required,
      ],
    }),
    arBasicInstructions:new FormControl('',{

    }),
    enBasicInstructions:new FormControl('',{

    }),
    settingId:new FormControl(''),
  })
  private apiService =inject(ApiService)
  private toaster =inject(ToasterService)

  ngOnInit(){
    this.getAll()
  }

  getAll(){
    this.apiService.get('Settings/GetAll').subscribe((res:any)=>{
        this.form.patchValue({
          ...res.data
        })
    })
  }

  onSubmit() {
    const payload = {
      ...this.form.value,
    }
    this.updateSocialMedia(payload)
  }

  updateSocialMedia(payload:any){
    this.apiService.put('settings/update',payload).subscribe((res:any)=>{
      console.log("SocialMediaUpdateComponent  this.apiService.put  res:", res)
      if(res.message)
        this.toaster.successToaster('Social Media Updated Successfully')
    })
  }



}
