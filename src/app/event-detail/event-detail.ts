import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {EventsService} from '../events.service';
import {Event} from '../event';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/events">← Back to events</a>
    @if (event$ | async; as event) {
      <section class="detail">
        <h1>{{ event.label }}</h1>
        <p class="dates">{{ event.startDate }} → {{ event.endDate }}</p>
        @if ((event.artists?.length ?? 0) > 0) {
          <div class="artists">
            <h2>Artists ({{ event.artists?.length }})</h2>
            <ul>
              @for (artist of event.artists ?? []; track artist.id) {
                <li>{{ artist.label }}</li>
              }
            </ul>
          </div>
        }
      </section>
    } @else {
      <div class="empty">Event not found.</div>
    }
  `,
  styleUrls: ['./event-detail.css'],
})
export class EventDetail {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);

  event$: Observable<Event | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.eventsService.getEventById(id) : of(null);
    }),
  );
}
