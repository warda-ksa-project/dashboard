import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [Dialog,ButtonModule,TranslatePipe],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
@Input()visible:boolean=false
@Input()header:string='shared.confirmation'
@Input()message:string='shared.confirmation_lost'
}
