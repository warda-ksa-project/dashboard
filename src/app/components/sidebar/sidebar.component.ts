import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, inject, Input} from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { menuItems, Roles } from '../../conts';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';
import { InputTextComponent } from '../input-text/input-text.component';
import { SelectComponent } from '../select/select.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor , Tooltip ,UpperCasePipe, TranslateModule, NgIf, RouterModule,InputTextComponent , RouterLinkActive, SelectComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent  {
  @Input()activeRoute=''
  selectedLang: any;
  languageService = inject(LanguageService);
  apiService=inject(ApiService)

  userDate=JSON.parse(localStorage.getItem('userData')as any);
  defaultImage=this.userDate?.gender==1?'assets/images/arabian-man.png':'assets/images/arabian-woman.png'
  routingList = menuItems
  role:any=''
  
  // Country dropdown
  countries: any[] = [];
  countryControl = new FormControl();
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.getRoles()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
     this.getRoles()
      this.selectedLang = this.languageService.translationService.currentLang;
      this.loadCountries();
    })
    this.loadCountries();
    this.initCountrySelection();
  }
  
  loadCountries() {
    this.apiService.get('Country/GetAll').subscribe((res: any) => {
      if (res.data) {
        this.countries = res.data.map((country: any) => ({
          name: this.selectedLang === 'en' ? country.enName : country.arName,
          code: country.id,
        }));
      }
    });
  }
  
  initCountrySelection() {
    const roleId = localStorage.getItem('roleId');
    this.isAdmin = roleId === Roles.admin;
    
    const savedCountryId = localStorage.getItem('countryId');
    if (savedCountryId) {
      this.countryControl.setValue(Number(savedCountryId));
    }
  }
  
  onCountryChange(countryId: number) {
    if (countryId) {
      localStorage.setItem('countryId', countryId.toString());
      // Reload to apply new country header
      window.location.reload();
    }
  }
  getRoles(){
    this.apiService.get('Auth/getRoles').subscribe((res:any)=>{
    this.role=res.data
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
