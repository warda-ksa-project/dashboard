import { Component, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';
import { Validations } from '../../../validations';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { Roles } from '../../../conts';

interface ISocialMediaUpsertPayload {
  id: number;
  whatsAppNumber: string;
  instagramLink: string;
  tikTokLink: string;
  faceBookLink: string;
  xLink: string;
  youTubeLink: string;
  snapChatLink: string;
}
@Component({
  selector: 'app-social-media-update',
  standalone: true,
  imports: [InputTextComponent, TranslatePipe, TitleCasePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './social-media-update.component.html',
  styleUrl: './social-media-update.component.scss'
})
export class SocialMediaUpdateComponent {
  userRole: string = '';
  isTrader: boolean = false;
  
  form:FormGroup=new FormGroup({
    id: new FormControl(0),
    whatsAppNumber:new FormControl('',{
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ],
    }),
    instagramLink:new FormControl(''),
    tikTokLink:new FormControl(''),
    faceBookLink:new FormControl(''),
    xLink: new FormControl(''),
    youTubeLink:new FormControl(''),
    snapChatLink: new FormControl(''),
  })
  private apiService =inject(ApiService)
  private toaster =inject(ToasterService)

  ngOnInit(){
    this.userRole = localStorage.getItem('role') || '';
    this.isTrader = this.userRole === Roles.trader;
    
    this.getAll()
  }

  getAll(){
    this.apiService.get('SocailMedia/GetAll').subscribe((res:any)=>{
      const data = Array.isArray(res?.data) ? res.data?.[0] : res?.data;
      if (!data) return;

      this.form.patchValue({
        ...data,
      })
    })
  }

  onSubmit() {
    const raw = this.form.getRawValue() as Partial<ISocialMediaUpsertPayload>;

    const payload: ISocialMediaUpsertPayload = {
      id: Number(raw.id ?? 0),
      whatsAppNumber: String(raw.whatsAppNumber ?? ''),
      instagramLink: String(raw.instagramLink ?? ''),
      tikTokLink: String(raw.tikTokLink ?? ''),
      faceBookLink: String(raw.faceBookLink ?? ''),
      xLink: String(raw.xLink ?? ''),
      youTubeLink: String(raw.youTubeLink ?? ''),
      snapChatLink: String(raw.snapChatLink ?? ''),
    };

    this.upsertSocialMedia(payload)
  }

  upsertSocialMedia(payload: ISocialMediaUpsertPayload){
    this.apiService.put('SocailMedia/upsert', payload).subscribe((res:any)=>{
      if(res?.message)
        this.toaster.successToaster(res.message)
      else
        this.toaster.successToaster('Social Media Updated Successfully')
    })
  }



}
