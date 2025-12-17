import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {Event} from '../event';
import {EventsService} from '../events.service';
import {Events} from '../events/events';

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [CommonModule, Events],
  template: `
    <section class="page-hero">
      <div>
        <p class="eyebrow">Events</p>
        <h1>Explore upcoming events</h1>
        <p class="sub">Fetched directly from the API.</p>
      </div>
    </section>
    <section class="results-grid">
      @if ((events$ | async)?.length === 0) {
        <div class="empty">No events yet. Create one in the API to see it here.</div>
      } @else {
        @for (e of (events$ | async) ?? []; track e.id) {
          <app-events [event]="e" />
        }
      }
    </section>
  `,
  styleUrls: ['./events-page.css'],
})
export class EventsPage {
  events$: Observable<Event[]>;
  private eventsService = inject(EventsService);

  constructor() {
    this.events$ = this.eventsService.getAllEvents();
  }
}
