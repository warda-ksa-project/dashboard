import {  NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ValidationHandlerPipePipe } from '../../pipes/validation-handler-pipe.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ValidationHandlerPipePipe,
    InputTextModule,
    DatePicker,
    TranslatePipe
  ],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class DatePickerComponent {

  @Input() label!: string;
  @Input() readOnly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() control: any = new FormControl();

}
