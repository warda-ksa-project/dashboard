import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'sidebarCollapsed';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  readonly collapsed = signal(this.readStored());

  toggle(): void {
    this.collapsed.update((v) => {
      const next = !v;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  setCollapsed(value: boolean): void {
    this.collapsed.set(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }

  private readStored(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }
}
