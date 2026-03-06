import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml',
  standalone: true
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength?: number): string {
    if (value == null || value === '') return '-';
    const div = document.createElement('div');
    div.innerHTML = value;
    const text = div.textContent || div.innerText || '';
    const stripped = text.trim().replace(/\s+/g, ' ');
    if (maxLength && stripped.length > maxLength) {
      return stripped.slice(0, maxLength) + '...';
    }
    return stripped || '-';
  }
}
