import {  NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { Select } from 'primeng/select';
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [MultiSelectModule,Select,NgIf, ReactiveFormsModule,FormsModule,ButtonModule,TranslatePipe],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent implements OnInit {
@Input()label:string=''
@Input()placeholder:any
@Input()showImage:boolean=false
@Input()disabled:boolean=false
@Input()readOnly:boolean=false
@Input()list:any=[]
@Input()type:string='single'
@Input()control:any =new FormControl()
@Output() onSelectedValue = new EventEmitter()
ngOnInit() {
  

}
onChange(item:any){
  this.onSelectedValue.emit(item.value)
}
}
