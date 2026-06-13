import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { ButtonModule } from 'primeng/button';
import { ToasterService } from '../../services/toaster.service';

interface OtpMetricsDto {
  sentLast24Hours: number;
  rejectedLast24Hours: number;
  blockedDevices: number;
  highRiskLast24Hours: number;
}

@Component({
  selector: 'app-otp-metrics',
  standalone: true,
  imports: [
    TranslatePipe,
    PageHeaderComponent,
    StatCardComponent,
    EmptyStateComponent,
    ButtonModule,
  ],
  templateUrl: './otp-metrics.component.html',
  styleUrl: './otp-metrics.component.scss',
})
export class OtpMetricsComponent implements OnInit {
  private api = inject(ApiService);
  private toaster = inject(ToasterService);

  loading = signal(true);
  error = signal<string | null>(null);
  metrics = signal<OtpMetricsDto | null>(null);

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<any>('admin/otp-metrics').subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res?.isFailure) {
          this.error.set(res?.error?.message || 'Failed to load OTP metrics');
          return;
        }
        this.metrics.set(res?.data ?? res);
      },
      error: (err) => {
        this.loading.set(false);
        const msg =
          err?.error?.error?.message ||
          err?.error?.message ||
          err?.message ||
          'Failed to load OTP metrics';
        this.error.set(msg);
        this.toaster.errorToaster(msg);
      },
    });
  }
}
