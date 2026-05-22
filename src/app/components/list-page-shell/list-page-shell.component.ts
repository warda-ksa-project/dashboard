import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBreadcrumb } from '../breadcrump/cerqel-breadcrumb.interface';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { PageToolbarComponent } from '../page-toolbar/page-toolbar.component';
import { CollapsibleFilterPanelComponent } from '../collapsible-filter-panel/collapsible-filter-panel.component';
import { FilterChipsComponent, FilterChip } from '../filter-chips/filter-chips.component';

@Component({
  selector: 'app-list-page-shell',
  standalone: true,
  imports: [
    PageHeaderComponent,
    PageToolbarComponent,
    CollapsibleFilterPanelComponent,
    FilterChipsComponent,
  ],
  templateUrl: './list-page-shell.component.html',
  styleUrl: './list-page-shell.component.scss',
})
export class ListPageShellComponent {
  @Input() pageTitle = '';
  @Input() pageIcon = 'pi pi-list';
  @Input() breadcrumb?: IBreadcrumb;
  @Input() searchValue = '';
  @Input() searchPlaceholder = 'shared.search';
  @Input() showSearch = true;
  @Input() showFilters = true;
  @Input() filtersExpanded = false;
  @Input() activeFilterCount = 0;
  @Input() filterChips: FilterChip[] = [];
  @Input() addLink = '';
  @Input() showAdd = true;

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterToggle = new EventEmitter<void>();
  @Output() filterSubmit = new EventEmitter<void>();
  @Output() filterReset = new EventEmitter<void>();
  @Output() chipRemove = new EventEmitter<string>();
}
