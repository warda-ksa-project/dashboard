import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'validationHandlerPipe',
  standalone: true,
  pure: false,
})
export class ValidationHandlerPipePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(value: any): string {
    const matches = this.getErrorKey(value);
    if (!matches) return '';

    let customMessage = '';
    if (matches === 'english_only') customMessage = value.english_only;
    if (matches === 'arabic_only') customMessage = value.arabic_only;
    if (matches === 'isMax') customMessage = value.isMax;
    if (matches === 'confirm_password') customMessage = value.confirm_password;

    if (customMessage) {
      return this.translate.instant(customMessage);
    }

    const key = `validation_message.${matches}_validation`;
    const translationWord = this.translate.instant(key);
    if (['minlength', 'maxlength'].includes(matches)) {
      const requiredLength =
        matches === 'minlength'
          ? value.minlength?.requiredLength
          : value.maxlength?.requiredLength;
      return `${translationWord} (${requiredLength})`;
    }

    return translationWord;
  }

  getErrorKey(errors: any): string | null {
    if (!errors || typeof errors !== 'object') {
      return null;
    }

    const keys = Object.keys(errors);
    return keys.length > 0 ? keys[0] : null;
  }
}
