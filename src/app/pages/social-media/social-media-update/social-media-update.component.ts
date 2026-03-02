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
  platformIds: Record<string, number> = {};

  form: FormGroup = new FormGroup({
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

  getAll() {
    this.apiService.get('Settings/social-media').subscribe((res: any) => {
      const list = res?.data ?? res ?? [];
      const arr = Array.isArray(list) ? list : [list];
      const byPlatform: Record<string, string> = {};
      arr.forEach((item: any) => {
        if (item?.platform) {
          const key = item.platform.toLowerCase();
          byPlatform[key] = item.url || '';
          this.platformIds[key] = item.id;
        }
      });
      this.form.patchValue({
        whatsAppNumber: byPlatform['whatsapp'] ?? '',
        instagramLink: byPlatform['instagram'] ?? '',
        faceBookLink: byPlatform['facebook'] ?? '',
        xLink: byPlatform['x'] ?? byPlatform['twitter'] ?? '',
        youTubeLink: byPlatform['youtube'] ?? '',
        tikTokLink: byPlatform['tiktok'] ?? '',
        snapChatLink: byPlatform['snapchat'] ?? ''
      });
    });
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

  upsertSocialMedia(payload: ISocialMediaUpsertPayload) {
    const items: { platform: string; url: string; id?: number }[] = [
      { platform: 'WhatsApp', url: payload.whatsAppNumber, id: this.platformIds['whatsapp'] },
      { platform: 'Instagram', url: payload.instagramLink, id: this.platformIds['instagram'] },
      { platform: 'Facebook', url: payload.faceBookLink, id: this.platformIds['facebook'] },
      { platform: 'X', url: payload.xLink, id: this.platformIds['x'] },
      { platform: 'YouTube', url: payload.youTubeLink, id: this.platformIds['youtube'] },
      { platform: 'TikTok', url: payload.tikTokLink, id: this.platformIds['tiktok'] },
      { platform: 'Snapchat', url: payload.snapChatLink, id: this.platformIds['snapchat'] }
    ];
    let done = 0;
    const total = items.length;
    items.forEach(item => {
      const body = { id: item.id ?? null, platform: item.platform, url: item.url || '', isActive: true };
      this.apiService.put('Settings/social-media', body).subscribe((res: any) => {
        done++;
        if (done >= total) this.toaster.successToaster('Social Media Updated Successfully');
      });
    });
    if (total === 0) this.toaster.successToaster('Social Media Updated Successfully');
  }



}
