import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IEditImage } from './editImage.interface';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-mode-image',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  templateUrl: './edit-mode-image.component.html',
  styleUrl: './edit-mode-image.component.scss'
})
export class EditModeImageComponent implements OnInit {
  private http = inject(HttpClient);
  @Input() editImageProps!: IEditImage;
  @Input() imgWidth = "50";
  @Input() type = 'image';
  @Input() hideEditBtn = false;
  @Output() onFileRemoved = new EventEmitter();
  @Input() action = 'Add';

  ngOnInit(): void { }

  isValidURL(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const s = url.trim();
    if (!s) return false;
    try {
      const parsed = new URL(s, 'http://localhost');
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' || s.startsWith('/') || s.startsWith('http') || s.startsWith('data:');
    } catch {
      return s.startsWith('data:') || s.startsWith('/');
    }
  }

  onEdit() {
    this.onFileRemoved.emit(null);
  }

  onDownloadPdf(): void {
    const url = this.editImageProps?.props?.imgSrc;
    if (!url || !this.isValidURL(url)) return;
    if (url.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      a.click();
      return;
    }
    const path = this.getPathFromUrl(url);
    if (!path) return;
    const apiUrl = `${environment.baseUrl}Files/download?path=${encodeURIComponent(path)}`;
    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const fileName = url.split('/').pop() || 'document.pdf';
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: () => window.open(url, '_blank')
    });
  }

  private getPathFromUrl(fullUrl: string): string | null {
    try {
      const u = new URL(fullUrl);
      const p = u.pathname.replace(/^\/+/, '');
      return p && p.includes('StaticFiles') ? p : null;
    } catch {
      return null;
    }
  }
}
