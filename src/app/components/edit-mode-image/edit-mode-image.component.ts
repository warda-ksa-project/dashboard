import { Component, Input } from '@angular/core';
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
export class EditModeImageComponent {
  @Input() editImageProps!: IEditImage;
  @Input() imgWidth="50"
}
