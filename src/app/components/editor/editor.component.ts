import { JsonPipe, NgIf } from '@angular/common';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { ValidationHandlerPipePipe } from '../../pipes/validation-handler-pipe.pipe';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [Editor,ReactiveFormsModule,FormsModule,NgIf,ValidationHandlerPipePipe,TranslatePipe],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnChanges {
  @Input() label!: string;
  @Input() readOnly: boolean=false;
  @Input() disabled: boolean=false;
  @Input() placeholder: string = '';
  @Input() control: any =new FormControl();


  OnInit(){
    
  }

  ngOnChanges(){
    // console.log("InputTextComponent  control:", this.control)

  }
}
