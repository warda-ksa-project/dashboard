import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-page-toolbar',
  standalone: true,
  imports: [FormsModule, RouterModule, TranslatePipe, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './page-toolbar.component.html',
  styleUrl: './page-toolbar.component.scss',
})
export class PageToolbarComponent {
  @Input() searchValue = '';
  @Input() searchPlaceholder = 'shared.search';
  @Input() showSearch = true;
  @Input() showFilters = true;
  @Input() filtersExpanded = false;
  @Input() activeFilterCount = 0;
  @Input() addLabel = 'shared.add_new';
  @Input() addLink = '';
  @Input() showAdd = true;

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterToggle = new EventEmitter<void>();
  @Output() addClick = new EventEmitter<void>();

  onSearchInput(value: string): void {
    this.searchChange.emit(value);
  }

  onFilterClick(): void {
    this.filterToggle.emit();
  }

  onAddClick(event: Event): void {
    if (!this.addLink) {
      event.preventDefault();
      this.addClick.emit();
    }
  }
}
