import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ValidationHandlerPipePipe } from '../../pipes/validation-handler-pipe.pipe';
import { DatePickerModule } from 'primeng/datepicker';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ValidationHandlerPipePipe,
    DatePickerModule,
    NgIf,
    TranslatePipe
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  @Input() label!: string;
  @Input() minDate: Date =new Date('11-02-1900');
  @Input() maxDate: Date =new Date('11-02-2090');
  @Input() readOnly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: any ;
  @Input() control: any = new FormControl();
  @Output()changeDate =new EventEmitter()

  onDateChange(event:any){
 this.changeDate.emit(event)
  }

  splitDate(date:any){
       return date?.split("T")[0]
  }
}
