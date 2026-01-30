import {Component, input, signal, output, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Event} from '../event';
import {ArtistsPreview} from '../artists-preview/artists-preview';
import {LanguageService} from '../language.service';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [RouterLink, ArtistsPreview, CommonModule],
  template: `
    <section class="listing">
      <div class="listing-header">
        <h2 class="listing-heading">
          <a class="listing-link" [routerLink]="['/events', event().id]">{{ event().label }}</a>
        </h2>
        <div class="actions-menu">
          <button class="menu-toggle" (click)="toggleMenu()" [attr.aria-expanded]="showMenu()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
          @if (showMenu()) {
            <div class="dropdown-menu">
              <a [routerLink]="['/events', event().id, 'edit']" (click)="closeMenu()" class="menu-item edit">
                {{ t('events.edit') }}
              </a>
              <button (click)="onDelete()" class="menu-item delete">
                {{ t('events.delete') }}
              </button>
            </div>
          }
        </div>
      </div>
      <p class="listing-location">{{ event().startDate }}, {{ event().endDate }}</p>
      <app-artists-preview [artists]="event().artists" />
      <div class="listing-actions">
        <a [routerLink]="['/events', event().id]">{{ t('events.viewDetails') }}</a>
      </div>
    </section>
  `,
  styleUrls: ['./events.css'],
})

export class Events {
  event = input.required<Event>();
  delete = output<string>();
  private languageService = inject(LanguageService);
  
  showMenu = signal(false);

  t(key: string): string {
    return this.languageService.t(key);
  }

  toggleMenu(): void {
    this.showMenu.update((v) => !v);
  }

  closeMenu(): void {
    this.showMenu.set(false);
  }

  onDelete(): void {
    if (confirm(`${this.t('events.deleteConfirm')} "${this.event().label}"?`)) {
      this.closeMenu();
      this.delete.emit(this.event().id);
    }
  }
}
