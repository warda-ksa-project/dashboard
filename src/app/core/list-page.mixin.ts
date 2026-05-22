import { FilterChip } from '../components/filter-chips/filter-chips.component';

export class ListPageFilterMixin {
  filtersExpanded = false;
  searchValue = '';
  filterChips: FilterChip[] = [];
  private searchTimeout?: ReturnType<typeof setTimeout>;

  toggleFilters(): void {
    this.filtersExpanded = !this.filtersExpanded;
  }

  get activeFilterCount(): number {
    return this.filterChips.length;
  }

  onSearchChange(
    value: string,
    reload: () => void,
    objectSearch?: Record<string, unknown>,
    searchKey = 'searchTerm'
  ): void {
    this.searchValue = value;
    if (objectSearch) {
      objectSearch[searchKey] = value;
      objectSearch['pageNumber'] = 1;
    }
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => reload(), 300);
  }

  updateChips(fields: { key: string; label: string; value: unknown }[]): void {
    this.filterChips = fields
      .filter((f) => f.value !== '' && f.value !== null && f.value !== undefined)
      .map((f) => ({ key: f.key, label: f.label, value: String(f.value) }));
  }

  removeChip(
    key: string,
    objectSearch: Record<string, unknown>,
    reload: () => void
  ): void {
    if (key in objectSearch) {
      objectSearch[key] = '';
    }
    this.filterChips = this.filterChips.filter((c) => c.key !== key);
    objectSearch['pageNumber'] = 1;
    reload();
  }
}
