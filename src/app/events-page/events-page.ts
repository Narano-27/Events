import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {EventPage, EventsService} from '../events.service';
import {Events} from '../events/events';

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [CommonModule, Events, RouterLink],
  template: `
    <section class="page-hero">
      <div>
        <p class="eyebrow">Events</p>
        <h1>Explore upcoming events</h1>
        <p class="sub">Fetched directly from the API.</p>
      </div>
      <a routerLink="/events/new" class="create-btn">+ Create Event</a>
    </section>
    @if (eventsPage$ | async; as page) {
      <section class="results-grid">
        @if ((page.content?.length ?? 0) === 0) {
          <div class="empty">No events yet. Create one in the API to see it here.</div>
        } @else {
          @for (e of page.content ?? []; track e.id) {
            <app-events [event]="e" (delete)="onDeleteEvent($event)" />
          }
        }
      </section>

      @if ((page.totalPages ?? 0) > 1) {
        <nav class="pagination" aria-label="Event pages">
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
  styleUrls: ['./events-page.css'],
})
export class EventsPage {
  eventsPage$: Observable<EventPage>;
  private page$ = new BehaviorSubject<number>(0);
  private eventsService = inject(EventsService);
  currentPage = 0;
  readonly pageSize = 10;
  readonly sort = 'label,asc';

  constructor() {
    this.eventsPage$ = this.page$.pipe(
      switchMap((page) => this.eventsService.getEventsPage(page, this.pageSize, this.sort)),
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

  onDeleteEvent(eventId: string): void {
    this.eventsService.deleteEvent(eventId).subscribe({
      next: () => {
        this.page$.next(this.currentPage);
      },
      error: (err) => {
        console.error('Error deleting event:', err);
      },
    });
  }
}
