import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TitleCasePipe, NgClass } from '@angular/common';
import { Validations } from '../../validations';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { TraderService } from '../../services/trader/trader.service';
import { forkJoin, Subscription } from 'rxjs';
import {
  TraderProfile,
  UpdateProfileReqBody,
} from '../../services/trader/trader.model';
import { Spinner } from '../../components/spinner/spinner';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { ToasterService } from '../../services/toaster.service';
import { CountryService } from '../../services/country.service';
import { CountriesService } from '../../services/countries/countries.service';
import { Country } from '../../services/countries/countries.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    TranslatePipe,
    TitleCasePipe,
    Spinner,
    NgClass,
    ReactiveFormsModule,
    InputTextComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [TraderService, CountriesService],
})
export class ProfileComponent implements OnInit, OnDestroy {
  //DEPS
  private traderService = inject(TraderService);
  private languageService = inject(LanguageService);
  private countriesService = inject(CountriesService);
  private toast = inject(ToasterService);

  //Hooks
  ngOnInit() {
    this.pageName.set(`profile.pageName`);
    this.getLang();
    this.getProfileInfo();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  //Priv Props
  private userId = +(localStorage.getItem('userId') as string);
  private subs = new Subscription();

  //Priv Methods
  private getLang() {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.getBreadCrumb();
    this.subs.add(
      this.languageService.translationService.onLangChange.subscribe(() => {
        this.selectedLang = this.languageService.translationService.currentLang;
        this.getBreadCrumb();
      }),
    );
  }

  private getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        {
          label: this.languageService.translate('Home'),
          routerLink: '/dashboard',
        },
        {
          label: this.languageService.translate(
            this.pageName() + '_' + 'View' + '_crumb',
          ),
        },
      ],
    };
  }

  private assignProfile(profile: TraderProfile) {
    this.profile = profile;
    this.profileForm.get('userName')?.patchValue(profile.userName);
    this.profileForm.get('storeName')?.patchValue(profile.storeName);
    this.profileForm.get('email')?.patchValue(profile.email);
    this.profileForm.get('phone')?.patchValue(profile.phone.replace('0', ''));
    this.profileForm.get('arDescription')?.patchValue(profile.descriptionAr);
    this.profileForm.get('enDescription')?.patchValue(profile.descriptionEn);
  }

  private assignCountry(country: Country) {
    this.country = country;
    this.profileForm
      .get('phone')
      ?.addValidators(
        Validations.phoneValidatorForSelectedCountry(this.country),
      );
  }

  private getProfileInfo() {
    const obs = forkJoin({
      profile: this.traderService.getProfile(this.userId),
      country: this.countriesService.getCountry(),
    });
    this.subs.add(
      obs.subscribe({
        next: (res) => {
          this.assignProfile(res.profile.data);
          this.assignCountry(res.country.data);
          this.loadingProfile = false;
        },
      }),
    );
  }

  //PROPS
  country!: Country;
  profileForm = new FormGroup({
    userName: new FormControl('', {
      validators: [Validators.required],
    }),
    storeName: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validations.emailValidator()],
    }),
    phone: new FormControl('', {
      validators: [Validators.required],
    }),
    arDescription: new FormControl('', {
      validators: [Validators.required],
    }),
    enDescription: new FormControl('', {
      validators: [Validators.required],
    }),
  });
  loadingProfile = true;
  profile!: TraderProfile;
  pageName = signal<string>(`profile.pageName`);
  readonly defaultImage = 'assets/images/arabian-man.png';

  updating = false;
  selectedLang = 'ar';
  bredCrumb: IBreadcrumb = {
    crumbs: [],
  };
  selectedImage: null | string = null;

  //METHODS
  imageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.src.includes(this.defaultImage)) {
      imgElement.style.display = 'none';
      return;
    }
    imgElement.src = this.defaultImage;
  }

  removeImage() {
    this.selectedImage = null;
  }

  imageSelected(event: Event) {
    const inputEle = event.target as HTMLInputElement;

    if (inputEle.files && inputEle.files.length > 0) {
      const file = inputEle.files[0];
      const fr = new FileReader();

      fr.onload = () => {
        this.selectedImage = fr.result as string;
      };

      fr.readAsDataURL(file);
    }
  }

  updateProfile() {
    this.updating = true;
    if (
      !this.profileForm.value.arDescription ||
      !this.profileForm.value.enDescription ||
      !this.profileForm.value.email ||
      !this.profileForm.value.phone ||
      !this.profileForm.value.storeName ||
      !this.profileForm.value.userName
    ) {
      this.toast.errorToaster(
        this.selectedLang === 'ar'
          ? 'جميع الحقول مطلوبة'
          : 'All Fields are required!',
      );
      this.updating = false;
      return;
    }
    const body: UpdateProfileReqBody = {
      addresses: this.profile.addresses.map((addr) => {
        return {
          cityId: addr.cityId,
          expalinedAddress: addr.expalinedAddress,
          id: addr.id,
          latitude: addr.latitude,
          logitude: addr.longitude,
        };
      }),
      arDescription: this.profileForm.value.arDescription,
      cr: this.profile.cr,
      email: this.profileForm.value.email,
      enDescription: this.profileForm.value.enDescription,
      iban: this.profile.iban,
      id: this.profile.id,
      image: this.selectedImage || this.profile.image,
      license: this.profile.license,
      name: this.profileForm.value.userName,
      numberOfBranches: this.profile.numberOfBranches,
      phone: this.profileForm.value.phone,
      phoneCountryCode: this.country.phoneCode,
      storeName: this.profileForm.value.storeName,
      supportsPickup: this.profile.supportsPickup,
    };
    this.subs.add(
      this.traderService.updateProfile(body).subscribe({
        next: (res) => {
          this.toast.successToaster(
            this.selectedLang === 'ar'
              ? 'تم التحديث بنجاح!'
              : 'Updated Successfully!',
          );
          this.updating = false;
        },
      }),
    );
  }
}
