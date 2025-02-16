import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'app-check-box',
  standalone: true,
  imports: [Checkbox,ReactiveFormsModule,ToggleSwitch,NgIf,TranslatePipe],
  templateUrl: './check-box.component.html',
  styleUrl: './check-box.component.scss'
})
export class CheckBoxComponent {
@Input()isToggle:boolean=false;
@Input()label:string='';
@Input()disabled:boolean=false;
@Input()readOnly:boolean=false;
@Input()initValue:boolean=false;
@Input()control:any =new FormControl()
@Output() toggleValue =new EventEmitter()
onToggleChange(value:any){
   this.toggleValue.emit(value.checked)
}

}
