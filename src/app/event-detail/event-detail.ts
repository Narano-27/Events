import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink, Router} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {EventsService} from '../events.service';
import {Event} from '../event';
import {LanguageService} from '../language.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/events">{{ t('events.backToEvents') }}</a>
    @if (event$ | async; as event) {
      <section class="detail">
        <div class="detail-header">
          <h1>{{ event.label }}</h1>
          <div class="detail-actions">
            <a [routerLink]="['/events', event.id, 'edit']" class="btn-edit">{{ t('events.edit') }}</a>
            <button (click)="onDelete(event.id, event.label)" class="btn-delete">{{ t('events.delete') }}</button>
          </div>
        </div>
        <p class="dates">{{ event.startDate }} → {{ event.endDate }}</p>
        @if ((event.artists?.length ?? 0) > 0) {
          <div class="artists">
            <h2>{{ t('events.artists') }} ({{ event.artists?.length }})</h2>
            <ul>
              @for (artist of event.artists ?? []; track artist.id) {
                <li>{{ artist.label }}</li>
              }
            </ul>
          </div>
        }
      </section>
    } @else {
      <div class="empty">{{ t('events.eventNotFound') }}</div>
    }
  `,
  styleUrls: ['./event-detail.css'],
})
export class EventDetail {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  t(key: string): string {
    return this.languageService.t(key);
  }

  event$: Observable<Event | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.eventsService.getEventById(id) : of(null);
    }),
  );

  onDelete(eventId: string, eventLabel: string): void {
    if (confirm(`${this.t('events.deleteConfirm')} "${eventLabel}"?`)) {
      this.eventsService.deleteEvent(eventId).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error('Error deleting event:', err);
          alert(this.t('events.deleteError'));
        },
      });
    }
  }
}
