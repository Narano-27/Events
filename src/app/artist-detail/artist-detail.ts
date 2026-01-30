import {Component, inject, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink, Router} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {EventsService} from '../events.service';
import {Artist} from '../artist';
import {Event} from '../event';
import {signal} from '@angular/core';
import {LanguageService} from '../language.service';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/artists">{{ t('artists.backToArtists') }}</a>

    @if (artist$ | async; as artist) {
      <section class="detail">
        <div class="detail-header">
          <h1>{{ artist.label }}</h1>
          <div class="detail-actions">
            <a [routerLink]="['/artists', artist.id, 'edit']" class="btn-edit">{{ t('artists.edit') }}</a>
            <button (click)="onDelete(artist.id, artist.label)" class="btn-delete">{{ t('artists.delete') }}</button>
          </div>
        </div>

        @if ((upcomingEvents$ | async)?.length ?? false) {
          <section class="events-section upcoming">
            @if (upcomingEvents$ | async; as upcoming) {
              <h2>{{ t('artists.upcomingEvents') }} ({{ upcoming.length }})</h2>
              <div class="events-list">
                @for (event of upcoming; track event.id) {
                  <div class="event-card">
                    <a [routerLink]="['/events', event.id]">{{ event.label }}</a>
                    <p class="event-dates">{{ event.startDate }} → {{ event.endDate }}</p>
                  </div>
                }
              </div>
            }
          </section>
        }

        @if ((pastEvents$ | async)?.length ?? false) {
          <section class="events-section past">
            @if (pastEvents$ | async; as past) {
              <h2>{{ t('artists.pastEvents') }} ({{ past.length }})</h2>
              <div class="events-list">
                @for (event of past; track event.id) {
                  <div class="event-card">
                    <a [routerLink]="['/events', event.id]">{{ event.label }}</a>
                    <p class="event-dates">{{ event.startDate }} → {{ event.endDate }}</p>
                  </div>
                }
              </div>
            }
          </section>
        }

        @if (!((upcomingEvents$ | async)?.length ?? false) && !((pastEvents$ | async)?.length ?? false)) {
          <div class="no-events">{{ t('artists.noEventsAssociated') }}</div>
        }
      </section>
    } @else {
      <div class="empty">{{ t('artists.artistNotFound') }}</div>
    }
  `,
  styleUrls: ['./artist-detail.css'],
})
export class ArtistDetail {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  t(key: string): string {
    return this.languageService.t(key);
  }

  artist$: Observable<Artist | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.eventsService.getArtistById(id) : of(null);
    }),
  );

  allEvents$: Observable<Event[]> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.eventsService.getArtistEvents(id) : of([]);
    }),
  );

  upcomingEvents$ = this.allEvents$.pipe(
    switchMap((events) => {
      const upcoming = events.filter((e) => new Date(e.endDate) >= new Date());
      return of(upcoming);
    }),
  );

  pastEvents$ = this.allEvents$.pipe(
    switchMap((events) => {
      const past = events.filter((e) => new Date(e.endDate) < new Date());
      return of(past);
    }),
  );

  hasEvents$ = this.allEvents$.pipe(
    switchMap((events) => of(events.length > 0)),
  );

  onDelete(artistId: string, artistLabel: string): void {
    if (confirm(`${this.t('artists.deleteConfirm')} "${artistLabel}"?`)) {
      this.eventsService.deleteArtist(artistId).subscribe({
        next: () => {
          this.router.navigate(['/artists']);
        },
        error: (err) => {
          console.error('Error deleting artist:', err);
          alert(this.t('artists.deleteError'));
        },
      });
    }
  }
}
