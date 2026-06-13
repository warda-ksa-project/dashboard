import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardUpdateEvent {
  updateType: string;
  entityType: string;
  entityId?: string;
  messageAr: string;
  messageEn: string;
  countryId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SignalRService implements OnDestroy {
  private connection?: signalR.HubConnection;
  private readonly dashboardUpdateSubject = new Subject<DashboardUpdateEvent>();
  readonly dashboardUpdate$ = this.dashboardUpdateSubject.asObservable();

  connect(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    if (
      this.connection?.state === signalR.HubConnectionState.Connected ||
      this.connection?.state === signalR.HubConnectionState.Connecting
    ) {
      return;
    }

    if (this.connection) {
      void this.connection.stop();
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, {
        accessTokenFactory: () => localStorage.getItem('token') ?? '',
        withCredentials: false,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(
        environment.production ? signalR.LogLevel.Warning : signalR.LogLevel.Information
      )
      .build();

    this.connection.on('ReceiveNotification', (type: string, payload: any) => {
      if (type !== 'DashboardUpdate') return;
      const event = this.parsePayload(payload);
      if (event) {
        this.dashboardUpdateSubject.next(event);
      }
    });

    void this.connection
      .start()
      .catch(() => {
        // automatic reconnect will retry
      });
  }

  disconnect(): void {
    if (this.connection) {
      void this.connection.stop();
      this.connection = undefined;
    }
  }

  ngOnDestroy(): void {
    this.dashboardUpdateSubject.complete();
    this.disconnect();
  }

  isOrderUpdate(event: DashboardUpdateEvent): boolean {
    return event.entityType === 'Order';
  }

  isTraderRequestUpdate(event: DashboardUpdateEvent): boolean {
    return (
      event.entityType === 'TraderRequest' ||
      event.updateType.startsWith('TraderRequest')
    );
  }

  isTraderUpdate(event: DashboardUpdateEvent): boolean {
    return (
      event.entityType === 'Trader' ||
      event.updateType === 'TraderCreated' ||
      event.updateType === 'TraderRequestApproved'
    );
  }

  private parsePayload(payload: any): DashboardUpdateEvent | null {
    const data = payload?.data ?? payload;
    if (!data) return null;

    return {
      updateType: data.updateType ?? data.UpdateType ?? '',
      entityType: data.entityType ?? data.EntityType ?? '',
      entityId: data.entityId ?? data.EntityId,
      messageAr: data.messageAr ?? data.MessageAr ?? '',
      messageEn: data.messageEn ?? data.MessageEn ?? '',
      countryId: data.countryId ?? data.CountryId,
    };
  }
}
