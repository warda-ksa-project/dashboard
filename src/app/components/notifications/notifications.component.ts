import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { Popover } from 'primeng/popover';
import { ApiService } from '../../services/api.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ModuleTypeEnum } from './type-module.enum';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [Popover,TranslatePipe, CommonModule, RouterModule, DialogModule, NgFor, NgIf],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnDestroy {

  private ApiService = inject(ApiService);

  notificationsList: any;
  showDialog = false;
  private totalUnSeenCount$ = new BehaviorSubject<number | null>(null);
  private audio = new Audio('assets/sounds/notifications.mp3');
  private isUserInteracted = false;
  selectedLang: any;
  languageService = inject(LanguageService);
  selectedNotification: any | null = null;
  totlaCount = 0;
  totalUnSeen = 0;
  @ViewChild('op') popover: Popover | undefined; // Reference to the popover
  private notificationsInterval: ReturnType<typeof setInterval> | null = null;



  ngOnInit(): void {
    window.addEventListener('click', () => this.isUserInteracted = true, { once: true });
    this.getNotifications();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getNotifications();
    })
    this.notificationsInterval = setInterval(() => {
      this.getNotifications();
    }, 180000);
  }

  ngOnDestroy(): void {
    if (this.notificationsInterval) {
      clearInterval(this.notificationsInterval);
    }
  }
  // ngOnInit(): void {
  //   this.getNotifications();

  //   setInterval(() => {
  //     this.getNotifications();
  //   }, 180000);
  // }

  getNotifications() {
    this.ApiService.get('Notifications').subscribe((noti: any) => {
      // Backend returns { data: [...] } - data is the list directly
      const list = noti?.data ?? [];
      this.notificationsList = Array.isArray(list) ? list : [];
      this.totlaCount = this.notificationsList.length;
      this.totalUnSeen = this.notificationsList.filter((n: any) => !n.isRead).length;

      const newCount = this.totalUnSeen;
      const oldCount = this.totalUnSeenCount$.value;

      if (oldCount !== null && newCount > oldCount && this.isUserInteracted) {
        this.playSound();
      }

      this.totalUnSeenCount$.next(newCount);
    });
  }

    playSound() {
    this.audio.currentTime = 0;
    this.audio.play().catch(error => console.log('Audio play blocked:', error));
  }

  constructor(private router: Router) { }

  getModuleIcon(module: number | string): string {
    const m = typeof module === 'string' ? this.parseModuleType(module) : module;
    switch (m) {
      case ModuleTypeEnum.Order:
        return 'OR';
      case ModuleTypeEnum.SpecialOrder:
        return 'SO';
      case ModuleTypeEnum.Text:
        return 'T';
      default:
        return '?';
    }
  }

  private parseModuleType(type: string): number {
    if (type === 'Order') return ModuleTypeEnum.Order;
    if (type === 'SpecialOrder') return ModuleTypeEnum.SpecialOrder;
    return ModuleTypeEnum.Text;
  }

  handleNotificationClick(notification: any) {
    const module = typeof notification.type === 'string' ? this.parseModuleType(notification.type) : (notification.module ?? 0);
    const id = notification.id ?? notification.notificationId;
    const refId = notification.referenceId ?? notification.entityId;

    if (module === ModuleTypeEnum.Text) {
      this.selectedNotification = notification;
      this.showDialog = true;
      this.seenNotification(id);
    } else {
      const route = module === ModuleTypeEnum.Order
        ? `/order/edit/${refId}`
        : `/special-order/edit/${refId}`;
      this.seenNotification(id);
      this.router.navigate([route]);
    }
    this.closePopover();
  }

  seenNotification(notificationId: number | string) {
    this.ApiService.putWithId('Notifications/mark-seen', notificationId, {}).subscribe(() => {
      this.getNotifications();
    });
  }

  closePopover() {
    if (this.popover) {
      this.popover.hide();
    }
  }
}
