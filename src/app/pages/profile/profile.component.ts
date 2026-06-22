import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TitleCasePipe, NgClass } from '@angular/common';
import { Validations } from '../../validations';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { IEditImage } from '../../components/edit-mode-image/editImage.interface';
import { TraderService } from '../../services/trader/trader.service';
import { Subscription } from 'rxjs';
import { TraderProfile } from '../../services/trader/trader.model';
import { Spinner } from '../../components/spinner/spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TranslatePipe, TitleCasePipe, Spinner, NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [TraderService],
})
export class ProfileComponent implements OnInit, OnDestroy {
  //DEPS
  private traderService = inject(TraderService);

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
  private languageService = inject(LanguageService);

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

  private getProfileInfo() {
    this.traderService.getProfile(this.userId).subscribe({
      next: (res) => {
        this.profile = res.data;
        this.loadingProfile = false;
      },
    });
  }

  //PROPS
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
}
