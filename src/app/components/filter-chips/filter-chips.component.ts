import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface FilterChip {
  key: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './filter-chips.component.html',
  styleUrl: './filter-chips.component.scss',
})
export class FilterChipsComponent {
  @Input() chips: FilterChip[] = [];
  @Output() remove = new EventEmitter<string>();
}
