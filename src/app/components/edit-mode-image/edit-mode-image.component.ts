import { Component, Input, OnInit } from '@angular/core';
import { IEditImage } from './editImage.interface';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-mode-image',
  standalone: true,
  imports: [NgIf,TranslatePipe],
  templateUrl: './edit-mode-image.component.html',
  styleUrl: './edit-mode-image.component.scss'
})
export class EditModeImageComponent implements OnInit{
  @Input() editImageProps!: IEditImage;
  @Input() imgWidth="50"
  @Input()type='image'
  @Input()hideEditBtn=false

  ngOnInit(): void {
      console.log('ffdd',this.editImageProps)
  }
}
