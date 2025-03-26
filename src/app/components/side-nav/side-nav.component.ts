import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { menuItems } from '../../conts';
import { ApiService } from '../../services/api.service';
import { InputTextComponent } from "../input-text/input-text.component";
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgFor, Tooltip, TranslateModule, RouterModule, RouterLinkActive, NgIf, InputTextComponent],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  // menu=[
  //   {
  //     id:1,
  //     name:'home',
  //     path:'/home',
  //     icon:'',
  //     selected:false
  //   },
  //   {
  //     id:2,
  //     name:'home',
  //     path:'/user',
  //     icon:'',
  //     selected:false
  //   },
  //   {
  //     id:3,
  //     name:'home',
  //     path:'/m',
  //     icon:'',
  //     selected:false
  //   },
  //   {
  //     id:3,
  //     name:'home',
  //     path:'/m',
  //     icon:'',
  //     selected:false
  //   },
  //   {
  //     id:3,
  //     name:'home',
  //     path:'/m',
  //     icon:'',
  //     selected:false
  //   },
  //   {
  //     id:3,
  //     name:'home',
  //     path:'/m',
  //     icon:'',
  //     selected:false
  //   }
  //   , {
  //     id:3,
  //     name:'home',
  //     path:'/m',
  //     icon:'',
  //     selected:false
  //   }
  // ]
  // showCollabseMenu:boolean=false
  // closeMenu:boolean=false
  // openMenu:boolean=true

 
  // navigateToPath(path:any){
  // console.log("SideNavComponent  navigateToPath  path:", path)

  // }

  
  //   /* NodeService */


  selectedLang: any;
  languageService = inject(LanguageService);
   apiService=inject(ApiService)
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
      console.log("SidebarComponent  this.apiService.get  res:", res)

    this.role=res.message
    console.log("SidebarComponent  this.apiService.get  this.role:", this.role)
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
