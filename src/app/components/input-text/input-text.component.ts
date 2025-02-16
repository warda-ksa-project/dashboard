import { JsonPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ValidationHandlerPipePipe } from '../../pipes/validation-handler-pipe.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    ValidationHandlerPipePipe,
    InputTextModule,
    TranslatePipe,
    Password,
    JsonPipe
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss'
})
export class InputTextComponent {
  @Input() type: string='text';
  @Input() label!: string;
  @Input() readOnly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() control: any = new FormControl();
  @Input()showPasswordWeakness:boolean=false
@Output()  onValueChange =new EventEmitter()

  OnInit(){
    console.log("InputTextComponent  control:", this.control)

  }

  onInputChange(value:any){
    this.onValueChange.emit(value)

  }
}
