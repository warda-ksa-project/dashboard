import { AbstractControl, ValidatorFn } from "@angular/forms";

 const arabicCharsRegex = /^[ء-ي0-9!@#\$%\^\& *\)\(+=._-]+]*$/;
 const englishCharsRegex = /^[A-Za-z0-9!@#<>\$%\^\& *\)\(+=._-]+]*$/;
const englishEditorRegex=  /^[a-zA-Z0-9\s<>&*#@!.,:;'"_-]*$|^[^\u0600-\u06FF]*$/;
const arabicEditorRegex=  /^[\u0600-\u06FF0-9\s<>&*#@!.,:;'"_-]*$/;;
 const charsRegex = /^[A-Za-zء-ي!@#\$%\^\& *\)\(+=._-]+]*$/;
 export const onlyArabicChar = /^[ء-ي]*$/;
 export const onlyEnglishChar = /^[A-Za-z]*$/;
 const urlRegex = /^((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)$/;
 const onlyNumbersRegex = /^[0-9]*$/
 const decimalNumber = /^-?[0-9]*\.?[0-9]*$/;
 const emailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const mobileNumberStartWith_5_Regex=/^5\d*$/


  export class Validations{
    static isEqualNumber(number:any,errorMessage: string): ValidatorFn {
      const errorMsg =errorMessage+' ( '+number+' )'
      return (control: AbstractControl<string>) => {
        var isValid = number >= control.value;
        return isValid ? null : { isMax: errorMsg };
      };
    }
   
 static emailValidator(errorMessage?: string): ValidatorFn {
  return (control: AbstractControl<string>) => {
    var isValid = emailRegex.test(control.value);
    return isValid ? null : { email: errorMessage };
  };
}

static editorEnglishCharsValidator(errorMessage?: string): ValidatorFn {
  return (control: AbstractControl<string>) => {
    var isValid = isEnglishEditorValidator(control.value);
    return isValid ? null : { english_char_only: errorMessage };
  };
}

static editorArabicCharsValidator(errorMessage?: string): ValidatorFn {
  return (control: AbstractControl<string>) => {
    var isValid = isArabicEditorValidator(control.value);
    return isValid ? null : { arabic_char_only: errorMessage };
  };
}
    static arabicCharsValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isArabic(control.value);
          return isValid ? null : { arabic_char_only: errorMessage };
        };
      }

      static englishCharsValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isEnglish(control.value);
          return isValid ? null : { english_char_only: errorMessage };
        };
      }
      static onlyArabicValidators(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isOnlyArabic(control.value);
          return isValid ? null : { arabic_only: errorMessage };
        };
      }

      static onlyEnglishValidators(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isOnlyEnglish(control.value);
          return isValid ? null : { english_only: errorMessage };
        };
      }

      static decimalNumberValidators(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isDecimal(control.value);
          return isValid ? null : { decimal_number: errorMessage };
        };
      }
      static onlyNumberValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isNumber(control.value);
          return isValid ? null : { only_number: errorMessage };
        };
      }

      static mobileStartWithNumber_5_Validator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isMobilenumberWith_5(control.value);
          return isValid ? null : { mobileNumber_5: errorMessage };
        };
      }

      static onlyCharacterValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isChar(control.value);
          return isValid ? null : { only_char: errorMessage };
        };
      }

      static confirmValue(input:any,errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = control.value === input;
          console.log("Validations  return  control:", control)
          return isValid ? null : { confirm_password: errorMessage };
        };
      }

      static phoneValidator(countries: any[], errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          const phoneValue = control.value?.toString().trim();
          
          if (!phoneValue) {
            return null; // Let required validator handle empty values
          }

          if (!countries || countries.length === 0) {
            return { 
              phoneInvalid: errorMessage || 'No countries available' 
            };
          }

          // Validate that the phone contains only numbers
          if (!onlyNumbersRegex.test(phoneValue)) {
            return { 
              phoneInvalid: errorMessage || 'Phone number must contain only digits' 
            };
          }

          // Try to find matching country by checking prefixes and length
          let matchingCountry = null;

          // Normalize phoneCode (API may return "+966" or "966")
          const norm = (pc: string) => (pc || '').replace(/^\+/, '');
          // Saudi Arabia: 05XXXXXXXX (10 digits) or 5XXXXXXXX (9 digits, backend format)
          if ((phoneValue.startsWith('05') && phoneValue.length === 10) || (phoneValue.startsWith('5') && phoneValue.length === 9)) {
            matchingCountry = countries.find(c => norm(c.phoneCode || '') === '966');
          }
          // Oman: 09/07/02 + 9 digits
          else if ((phoneValue.startsWith('09') || phoneValue.startsWith('07') || phoneValue.startsWith('02')) && phoneValue.length === 9) {
            matchingCountry = countries.find(c => norm(c.phoneCode || '') === '968');
          }

          if (!matchingCountry) {
            return { 
              phoneInvalid: errorMessage || 'Invalid phone number format' 
            };
          }

          return null;
        };
      }

      static phoneValidatorForSelectedCountry(country: any | null, errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          const phoneValue = control.value?.toString().trim();
          
          if (!phoneValue) {
            return null;
          }

          if (!country) {
            return { 
              phoneInvalid: errorMessage || 'Country not selected' 
            };
          }

          if (!onlyNumbersRegex.test(phoneValue)) {
            return { 
              phoneInvalid: errorMessage || 'Phone number must contain only digits' 
            };
          }

          const expectedLength = parseInt(country.phoneLength) || 9;
          const code = (country.phoneCode || '').replace(/^\+/, '');

          // Saudi: backend has length 9 (5XXXXXXXX), but users often enter 05XXXXXXXX (10)
          const isValidLength = code === '966'
            ? (phoneValue.length === expectedLength || (expectedLength === 9 && phoneValue.length === 10 && phoneValue.startsWith('05')))
            : phoneValue.length === expectedLength;

          if (!isValidLength) {
            return { 
              phoneInvalid: errorMessage || (code === '966' 
                ? `Phone must be 9 digits (5XXXXXXXX) or 10 digits (05XXXXXXXX)` 
                : `Phone number must be ${expectedLength} digits`) 
            };
          }

          if (code === '966') {
            if (!phoneValue.startsWith('05') && !phoneValue.startsWith('5')) {
              return { 
                phoneInvalid: errorMessage || 'Saudi phone number must start with 05 or 5' 
              };
            }
          }

          if (code === '968') {
            const firstTwoDigits = phoneValue.substring(0, 2);
            const validPrefixes = ['09', '07', '02'];
            
            if (!validPrefixes.includes(firstTwoDigits)) {
              return { 
                phoneInvalid: errorMessage || 'Oman phone number must start with 09, 07, or 02' 
              };
            }
          }

          return null;
        };
      }
  }



  
  export function removePtags(input: string): string {
    return input.replace(/<\/?p>/g, ''); 
  }


  export function isArabic(value: string): boolean {
    if (value) {
      return arabicCharsRegex.test(value);
    } else {
      return true;
    }
  }

  export function isEnglish(value: string): boolean {
    if (value) {
      return englishCharsRegex.test(value);
    } else {
      return true;
    }
  }
  export function isEnglishEditorValidator(value: string): boolean {
    if (value) {
      return englishEditorRegex.test(value);
    } else {
      return true;
    }
  }
  export function isArabicEditorValidator(value: string): boolean {
    if (value) {
      return arabicEditorRegex.test(removePtags(value));
    } else {
      return true;
    }
  }

  export function isOnlyEnglish(value: string): boolean {
    if (value) {
      return onlyEnglishChar.test(value);
    } else {
      return true;
    }
  }

  export function isOnlyArabic(value: string): boolean {
    if (value) {
      return onlyArabicChar.test(value);
    } else {
      return true;
    }
  }

  export function isNumber(value: string): boolean {
    if (value) {
      return onlyNumbersRegex.test(value);
    } else {
      return true;
    }
  }

  export function isMobilenumberWith_5(value: string): boolean {
    if (value) {
      return mobileNumberStartWith_5_Regex.test(value);
    } else {
      return true;
    }
  }
  

  export function isDecimal(value: string): boolean {
    if (value) {
      return decimalNumber.test(value);
    } else {
      return true;
    }
  }
  export function isChar(value: string): boolean {
    if (value) {
      return charsRegex.test(value);
    } else {
      return true;
    }
  }
