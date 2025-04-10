import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { FileUpload, UploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [FileUpload, NgFor, NgIf, TranslatePipe],
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
export class UploadFileComponent implements OnChanges{
  uploadedFiles: any[] = [];
  imageBase64: string | null = null;
  @Input() isMulti: boolean = false;
  @Input()accept="image/*,video/*"
  @Input()defaultImages:any
  @Output() onFileRemoved =new EventEmitter()
  onChange: (value: any | null) => void = () => { };
  onTouched: () => void = () => { };
  isDisabled = false;



  ngOnChanges(changes: any): void {
    if (changes.defaultImages && changes.defaultImages.currentValue) {
      // console.log("UploadFileComponent  ngOnChanges  changes:", changes.defaultImages.currentValue)

    }
  }

  private setDefaultImages(images: any): void {
    if (this.isMulti) {
      this.uploadedFiles = Array.isArray(images) ? images : [];
      this.onChange(this.uploadedFiles);
    } else {
      this.imageBase64 = typeof images === 'string' ? images : null;
      this.onChange(this.imageBase64);
    }
  }
  onSelect(event: any): void {
    const files = event.currentFiles;
    console.log("UploadFileComponent  onSelect  files:", files)
   this.selectFile(files)
  }

  selectFile(files:any){
    if (files) {
      if (this.isMulti) {    
        const promises = files.map((file: File) => {
          return this.convertFileToBase64(file).then((base64String: string) => ({
            image: base64String,
            mediaTypeEnum: file.type.startsWith('image/') ? 1 : file.type.startsWith('video/') ? 2 : 0,
          }));
        });
    
        Promise.all(promises)
          .then((processedFiles) => {
            console.log(processedFiles); // Final processed array
            this.uploadedFiles.push(...processedFiles); // Add to `uploadedFiles`
          })
          .catch((error) => {
            console.error('Error processing files:', error);
          });
          console.log("UploadFileComponent  .then    this.uploadedFiles:",  )
          this.onChange(this.uploadedFiles);
      } else
        this.convertFileToBase64(files[0]).then((base64String: string) => {
          this.imageBase64 = base64String;
          this.onChange(this.imageBase64);
        }).catch(error => {
          console.error('Error converting to Base64:', error);
        });
    }
  }
  onClear(event:any){
  console.log("UploadFileComponent  onClear  event:", event)
  this.onFileRemoved.emit(null)

  }
  onRemove(event:any){
     console.log("UploadFileComponent  onRemove  event:", event)
     this.onFileRemoved.emit(null)

     if(this.isMulti){
      this.convertFileToBase64(event.file).then((base64String: string) => {
        this.uploadedFiles=  this.uploadedFiles.filter(res=>res.image !==base64String)     
        this.onChange(this.uploadedFiles);

      }).catch(error => {
        console.error('Error converting to Base64:', error);
      });
     }else
     this.onChange("");
   
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
    console.log("UploadFileComponent  ****   this.imageBase64:",  this.imageBase64)
    this.setDefaultImages(value);

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
