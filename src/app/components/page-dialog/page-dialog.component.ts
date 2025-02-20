import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-page-dialog',
  standalone: true,
  imports: [Dialog,TranslatePipe],
  templateUrl: './page-dialog.component.html',
  styleUrl: './page-dialog.component.scss'
})
export class PageDialogComponent {
@Input()visible:boolean=false
@Input()header:string=''
@Input()close:string='false'
@Input()width:string='30rem'
}
