import { Component, inject, ViewChild } from '@angular/core';
import { Popover } from 'primeng/popover';
import { ApiService } from '../../services/api.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ModuleTypeEnum } from './type-module.enum';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [Popover,TranslatePipe, CommonModule, RouterModule, DialogModule, NgFor, NgIf],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

  private ApiService = inject(ApiService);

  notificationsList: any;
  showDialog = false;
  selectedNotification: any | null = null;
  totlaCount = 0;
  totalUnSeen = 0;
  @ViewChild('op') popover: Popover | undefined; // Reference to the popover


  ngOnInit(): void {
    this.getNotifications();

    setInterval(() => {
      this.getNotifications();
    }, 180000);
  }

  getNotifications() {
    this.ApiService.get('Notification/GetNotifications').subscribe((noti: any) => {
      this.notificationsList = noti.data.data;
      this.totlaCount = noti.data.totalCount;
      this.totalUnSeen = noti.data.totalUnSeenCount;
    });
  }

  constructor(private router: Router) { }

  getModuleIcon(module: number): string {
    switch (module) {
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

  handleNotificationClick(notification: any) {
    if (notification.module === ModuleTypeEnum.Text) {
      this.selectedNotification = notification;
      this.showDialog = true;
      this.seenNotification(notification.notificationId);
    } else {
      // Navigate to the appropriate route based on the module type
      const route = notification.module === ModuleTypeEnum.Order
        ? `/order/edit/${notification.entityId}`
        : `/special-order/edit/${notification.entityId}`;
      this.seenNotification(notification.notificationId);
      this.router.navigate([route]);
    }
    this.closePopover();
  }

  seenNotification(orderId: any) {
    this.ApiService.put(
      `Notification/seenNotification?id=${orderId}`,
      {}
    ).subscribe((res: any) => {
      console.log(res);
      this.getNotifications();
    });
  }

  closePopover() {
    if (this.popover) {
      this.popover.hide();
    }
  }
}
