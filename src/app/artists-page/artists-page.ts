import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {ArtistPage, EventsService} from '../events.service';
import {Artist} from '../artist-card/artist-card';

@Component({
  selector: 'app-artists-page',
  standalone: true,
  imports: [CommonModule, RouterLink, Artist],
  template: `
    <section class="page-hero">
      <div>
        <p class="eyebrow">Artists</p>
        <h1>Explore our artists</h1>
        <p class="sub">Discover all registered artists.</p>
      </div>
      <a routerLink="/artists/new" class="create-btn">+ Add Artist</a>
    </section>
    @if (artistsPage$ | async; as page) {
      <section class="results-grid">
        @if ((page.content?.length ?? 0) === 0) {
          <div class="empty">No artists yet. Create one to see it here.</div>
        } @else {
          @for (a of page.content ?? []; track a.id) {
            <app-artist [artist]="a" (delete)="onDeleteArtist($event)" />
          }
        }
      </section>

      @if ((page.totalPages ?? 0) > 1) {
        <nav class="pagination" aria-label="Artist pages">
          <button type="button" (click)="prevPage()" [disabled]="currentPage === 0">
            Previous
          </button>
          <div class="pages">
            @for (p of pageNumbers(page.totalPages ?? 0); track p) {
              <button
                type="button"
                (click)="goToPage(p)"
                [class.active]="currentPage === p"
                [attr.aria-current]="currentPage === p ? 'page' : null"
              >
                {{ p + 1 }}
              </button>
            }
          </div>
          <button
            type="button"
            (click)="nextPage(page.totalPages ?? 0)"
            [disabled]="currentPage >= (page.totalPages ?? 1) - 1"
          >
            Next
          </button>
          <span class="page-indicator">Page {{ currentPage + 1 }} / {{ page.totalPages ?? 1 }}</span>
        </nav>
      }
    }
  `,
  styleUrls: ['./artists-page.css'],
})
export class ArtistsPage {
  artistsPage$: Observable<ArtistPage>;
  private page$ = new BehaviorSubject<number>(0);
  private eventsService = inject(EventsService);
  currentPage = 0;
  readonly pageSize = 10;
  readonly sort = 'label,asc';

  constructor() {
    this.artistsPage$ = this.page$.pipe(
      switchMap((page) => this.eventsService.getArtistsPage(page, this.pageSize, this.sort)),
    );
  }

  goToPage(page: number): void {
    if (page < 0) {
      return;
    }
    this.currentPage = page;
    this.page$.next(page);
  }

  prevPage(): void {
    this.goToPage(Math.max(0, this.currentPage - 1));
  }

  nextPage(totalPages: number): void {
    if (totalPages <= 0) {
      return;
    }
    this.goToPage(Math.min(this.currentPage + 1, totalPages - 1));
  }

  pageNumbers(totalPages: number): number[] {
    return Array.from({length: totalPages}, (_, i) => i);
  }

  onDeleteArtist(artistId: string): void {
    this.eventsService.deleteArtist(artistId).subscribe({
      next: () => {
        this.page$.next(this.currentPage);
      },
      error: (err) => {
        console.error('Error deleting artist:', err);
      },
    });
  }
}
