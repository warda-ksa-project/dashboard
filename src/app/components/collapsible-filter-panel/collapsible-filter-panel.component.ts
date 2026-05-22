import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-collapsible-filter-panel',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './collapsible-filter-panel.component.html',
  styleUrl: './collapsible-filter-panel.component.scss',
})
export class CollapsibleFilterPanelComponent {
  @Input() expanded = false;
  @Output() submit = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
}
