import {Component, input, signal, output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Artist as ArtistInterface} from '../artist';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <section class="listing">
      <div class="listing-header">
        <h2 class="listing-heading">
          <a class="listing-link" [routerLink]="['/artists', artist().id]">{{ artist().label }}</a>
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
              <a [routerLink]="['/artists', artist().id, 'edit']" (click)="closeMenu()" class="menu-item edit">
                Edit
              </a>
              <button (click)="onDelete()" class="menu-item delete">
                Delete
              </button>
            </div>
          }
        </div>
      </div>
      <div class="listing-actions">
        <a [routerLink]="['/artists', artist().id]">View profile</a>
      </div>
    </section>
  `,
  styleUrls: ['./artist-card.css'],
})

export class Artist {
  artist = input.required<ArtistInterface>();
  delete = output<string>();
  
  showMenu = signal(false);

  toggleMenu(): void {
    this.showMenu.update((v) => !v);
  }

  closeMenu(): void {
    this.showMenu.set(false);
  }

  onDelete(): void {
    if (confirm(`Are you sure you want to delete "${this.artist().label}"?`)) {
      this.closeMenu();
      this.delete.emit(this.artist().id);
    }
  }
}
