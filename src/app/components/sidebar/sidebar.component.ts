import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { menuItems } from '../../conts';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';
import { InputTextComponent } from '../input-text/input-text.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor , Tooltip ,UpperCasePipe, TranslateModule, NgIf, RouterModule,InputTextComponent , RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  selectedLang: any;
languageService = inject(LanguageService);
     apiService=inject(ApiService)
  
  userDate=JSON.parse(localStorage.getItem('userData')as any);
  defaultImage=this.userDate?.gender==1?'assets/images/arabian-man.png':'assets/images/arabian-woman.png'
  routingList = menuItems
  role:any=''
  ngOnInit(): void {
    this.getRoles()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
     this.getRoles()
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }
  getRoles(){
    this.apiService.get('Auth/getRoles').subscribe((res:any)=>{
    this.role=res.message
    })
  }
  onFilterMenu(text:string){
    this.routingList= this.routingList.filter(item => item.id.toLowerCase().includes(text.toLowerCase()));
          if(text=='')
            this.routingList=   menuItems
    }

  logOut(){
    localStorage.clear()
    
  }
}
