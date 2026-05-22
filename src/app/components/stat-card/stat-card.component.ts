import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input() icon = 'pi pi-chart-line';
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() suffix = '';
  @Input() trend?: number;
  @Input() trendLabel = '';
}
