import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {ArtistPage, EventsService} from '../events.service';
import {Artist} from '../artist-card/artist-card';
import {LanguageService} from '../language.service';

@Component({
  selector: 'app-artists-page',
  standalone: true,
  imports: [CommonModule, RouterLink, Artist],
  template: `
    <section class="page-hero">
      <div>
        <p class="eyebrow">{{ t('artists.title') }}</p>
        <h1>{{ t('artists.exploreArtists') }}</h1>
        <p class="sub">{{ t('artists.discoverAll') }}</p>
      </div>
      <a routerLink="/artists/new" class="create-btn">{{ t('artists.addArtist') }}</a>
    </section>
    @if (artistsPage$ | async; as page) {
      <section class="results-grid">
        @if ((page.content?.length ?? 0) === 0) {
          <div class="empty">{{ t('artists.noArtistsYet') }}</div>
        } @else {
          @for (a of page.content ?? []; track a.id) {
            <app-artist [artist]="a" (delete)="onDeleteArtist($event)" />
          }
        }
      </section>

      @if ((page.totalPages ?? 0) > 1) {
        <nav class="pagination" aria-label="Artist pages">
          <button type="button" (click)="prevPage()" [disabled]="currentPage === 0">
            {{ t('common.previous') }}
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
            {{ t('common.next') }}
          </button>
          <span class="page-indicator">{{ t('common.page') }} {{ currentPage + 1 }} / {{ page.totalPages ?? 1 }}</span>
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
  private languageService = inject(LanguageService);
  currentPage = 0;
  readonly pageSize = 10;
  readonly sort = 'label,asc';

  t(key: string): string {
    return this.languageService.t(key);
  }

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
