import {Component, inject, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {EventsService} from '../events.service';
import {Artist} from '../artist';
import {Event} from '../event';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/artists">← Back to artists</a>

    @if (artist$ | async; as artist) {
      <section class="detail">
        <h1>{{ artist.label }}</h1>

        @if ((upcomingEvents$ | async)?.length ?? false) {
          <section class="events-section upcoming">
            @if (upcomingEvents$ | async; as upcoming) {
              <h2>Upcoming Events ({{ upcoming.length }})</h2>
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
              <h2>Past Events ({{ past.length }})</h2>
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
          <div class="no-events">No events associated with this artist.</div>
        }
      </section>
    } @else {
      <div class="empty">Artist not found.</div>
    }
  `,
  styleUrls: ['./artist-detail.css'],
})
export class ArtistDetail {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);

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
}
