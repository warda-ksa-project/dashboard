import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToasterService } from './services/toaster.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';
import { PrimeNG } from 'primeng/config';
import { ConfirmMsgService } from './services/confirm-msg.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule , FormsModule , TranslateModule , ToastModule , Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService , ToasterService , PrimeNG,ConfirmMsgService,ConfirmationService]
})


export class AppComponent {


 toaster = inject(ToasterService);


ngOnInit(): void {
}

}
