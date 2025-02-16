import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [DrawerModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class DrawerComponent implements OnInit, OnChanges {
  @Output() onClose = new EventEmitter()
  @Input() visible: boolean = false;
  @Input() header: string = ""
  languageService = inject(LanguageService);
  selectedLang: any;

  ngOnInit() {
    this.header=this.languageService.translate(this.header)
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.header=this.languageService.translate(this.header)

    })
  }

  ngOnChanges() {
  }

  onHide($event:any){
    this.onClose.emit(true)

  }

}
