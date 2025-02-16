import { NgFor, NgIf } from '@angular/common';
import { Component , forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { FileUpload, UploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [FileUpload, NgFor, NgIf,TranslatePipe],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFileComponent),
      multi: true
    }
  ]
})
export class UploadFileComponent {
  uploadedFiles: any[] = [];
  imageBase64: string | null = null;

  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};
  isDisabled = false;

  constructor() {}

  onSelect(event: any): void {
    const file = event.currentFiles[0];
    if (file) {
      this.convertFileToBase64(file).then((base64String: string) => {
        this.imageBase64 = base64String;
        this.onChange(this.imageBase64);
      }).catch(error => {
        console.error('Error converting to Base64:', error);
      });
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  writeValue(value: string | null): void {
    this.imageBase64 = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}


// add this part to the compnent you are going to use it
// get isRequiredError(): boolean {
//   const control = this.form.get('uploadedImage');
//   return control?.touched && control?.hasError('required') || false;
// }

//this code add it in the form
// uploadedImage: new FormControl(null, {
//   validators: [
//     Validators.required,
//   ]
// }),

//this code to the  html form
// <div class="upload-image-section mt-4 mb-4">
//           <app-upload-file formControlName="uploadedImage"></app-upload-file>
//           <div *ngIf="isRequiredError" class="error-message mt-2">
//             Image upload is required.
//           </div>
//         </div>
