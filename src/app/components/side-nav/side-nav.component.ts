import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { menuItems } from '../../conts';
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
  routingList = menuItems
  role:any
  @Input()activeRoute=''

  ngOnInit(): void {
    this.getRoles()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.getRoles()
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }

  getRoles(){
    this.role = localStorage.getItem('role') || '';
  }

  onFilterMenu(text:string){
    this.routingList= this.routingList.filter(item => item.id.toLowerCase().includes(text.toLowerCase()));
          if(text=='')
            this.routingList=   menuItems
    }

private router = inject(Router);

  logOut(){
    this.router.navigate(['/auth/login']).then(() => localStorage.clear());
  }
}
