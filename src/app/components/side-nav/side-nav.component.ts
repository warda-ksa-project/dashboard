import { NgFor, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { menuItems } from '../../conts';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgFor , Tooltip , TranslateModule , RouterModule , RouterLinkActive,TitleCasePipe],
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

  routingList = menuItems

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }



}
