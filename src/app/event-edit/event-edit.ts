import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {EventsService} from '../events.service';
import {Event} from '../event';
import {Artist} from '../artist';
import {signal} from '@angular/core';
import {LanguageService} from '../language.service';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/events">{{ t('events.backToEvents') }}</a>

    @if (event$ | async; as event) {
      <section class="form-container">
        <h1>{{ t('events.edit') }} {{ t('events.title') }}</h1>

        <form (ngSubmit)="onSubmit()" #eventForm="ngForm">
          <div class="form-group">
            <label for="label">{{ t('events.eventName') }} *</label>
            <input
              type="text"
              id="label"
              name="label"
              [(ngModel)]="formData.label"
              required
              placeholder="e.g., Hellfest 2025"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="startDate">{{ t('events.startDate') }} *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                [(ngModel)]="formData.startDate"
                required
              />
            </div>

            <div class="form-group">
              <label for="endDate">{{ t('events.endDate') }} *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                [(ngModel)]="formData.endDate"
                required
              />
            </div>
          </div>

          @if (errorMessage()) {
            <div class="error-message">{{ errorMessage() }}</div>
          }

          @if (successMessage()) {
            <div class="success-message">{{ successMessage() }}</div>
          }

          <div class="form-actions">
            <button type="submit" [disabled]="!eventForm.form.valid || isSubmitting()">
              {{ isSubmitting() ? t('events.saving') : t('events.saveChanges') }}
            </button>
            <button type="button" class="btn-danger" (click)="onDelete()">
              {{ t('events.delete') }}
            </button>
          </div>
        </form>

        <section class="artist-section">
          <h2>{{ t('events.manageArtists') }}</h2>
          <p class="info">{{ t('events.manageArtistsInfo') }}</p>

          <div class="search-container">
            <input
              type="text"
              [(ngModel)]="artistSearchTerm"
              (input)="onSearchArtist()"
              [placeholder]="t('events.searchArtists')"
              class="search-input"
            />
          </div>

          @if (artistSearchResults().length > 0) {
            <ul class="artist-results">
              @for (artist of artistSearchResults(); track artist.id) {
                <li>
                  <span class="artist-name">{{ artist.label }}</span>
                  <button
                    type="button"
                    (click)="addArtistToEvent(artist)"
                    [disabled]="isAddingArtist() || addedArtistIds().includes(artist.id)"
                  >
                    {{ addedArtistIds().includes(artist.id) ? t('events.added') : t('events.add') }}
                  </button>
                </li>
              }
            </ul>
          }

          @if (artistSearchTerm.length > 0 && artistSearchResults().length === 0 && !isSearching()) {
            <div class="no-results">{{ t('events.noArtistsFound') }}</div>
          }

          @if ((event.artists?.length ?? 0) > 0) {
            <div class="current-artists">
              <h3>{{ t('events.currentArtists') }} ({{ event.artists?.length }})</h3>
              <ul>
                @for (artist of event.artists ?? []; track artist.id) {
                  <li class="artist-item">
                    <span>{{ artist.label }}</span>
                    <button
                      type="button"
                      (click)="removeArtistFromEvent(artist.id)"
                      [disabled]="isRemovingArtist()"
                      class="btn-remove"
                    >
                      ✕
                    </button>
                  </li>
                }
              </ul>
            </div>
          }

          @if (artistError()) {
            <div class="error-message">{{ artistError() }}</div>
          }
        </section>
      </section>
    } @else {
      <div class="empty">{{ t('events.eventNotFound') }}</div>
    }
  `,
  styleUrls: ['./event-edit.css'],
})
export class EventEdit {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  t(key: string): string {
    return this.languageService.t(key);
  }

  getCurrentLanguage() {
    return this.languageService.getCurrentLanguage();
  }

  event$: Observable<Event | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.eventsService.getEventById(id) : of(null);
    }),
  );

  formData = {
    label: '',
    startDate: '',
    endDate: '',
  };

  artistSearchTerm = '';
  artistSearchResults = signal<Artist[]>([]);
  isSearching = signal(false);
  isSubmitting = signal(false);
  isAddingArtist = signal(false);
  isRemovingArtist = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  artistError = signal('');
  addedArtistIds = signal<string[]>([]);
  currentEventId: string | null = null;

  constructor() {
    this.event$.subscribe((event) => {
      if (event) {
        this.currentEventId = event.id;
        this.formData = {
          label: event.label,
          startDate: event.startDate,
          endDate: event.endDate,
        };
        this.addedArtistIds.set(event.artists?.map((a) => a.id) ?? []);
      }
    });
  }

  onSubmit(): void {
    if (!this.currentEventId) return;
    this.errorMessage.set('');
    this.successMessage.set('');
    
    // Validate name length
    if (this.formData.label.trim().length < 3) {
      this.errorMessage.set(this.t('events.nameMinLength'));
      return;
    }
    
    // Validate dates
    const startDate = new Date(this.formData.startDate);
    const endDate = new Date(this.formData.endDate);
    
    if (startDate > endDate) {
      this.errorMessage.set(
        this.getCurrentLanguage() === 'fr' 
          ? 'La date de début doit être antérieure à la date de fin.'
          : 'Start date must be before end date.'
      );
      return;
    }
    
    this.isSubmitting.set(true);

    this.eventsService.updateEvent(this.currentEventId, this.formData).subscribe({
      next: () => {
        this.successMessage.set(this.t('events.updateSuccess'));
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(this.t('events.updateError'));
        this.isSubmitting.set(false);
        console.error('Error updating event:', err);
      },
    });
  }

  onDelete(): void {
    if (!this.currentEventId) return;
    if (confirm(`${this.t('events.deleteConfirm')} "${this.formData.label}"?`)) {
      this.eventsService.deleteEvent(this.currentEventId).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (err) => {
          this.errorMessage.set(this.t('events.deleteError'));
          console.error('Error deleting event:', err);
        },
      });
    }
  }

  onSearchArtist(): void {
    const term = this.artistSearchTerm.trim();
    if (term.length === 0) {
      this.artistSearchResults.set([]);
      return;
    }

    this.isSearching.set(true);
    this.eventsService.searchArtistsByName(term).subscribe({
      next: (artists) => {
        this.artistSearchResults.set(artists);
        this.isSearching.set(false);
      },
      error: (err) => {
        console.error('Error searching artists:', err);
        this.isSearching.set(false);
      },
    });
  }

  addArtistToEvent(artist: Artist): void {
    if (!this.currentEventId) return;

    this.artistError.set('');
    this.isAddingArtist.set(true);

    this.eventsService.addArtistToEvent(this.currentEventId, artist.id).subscribe({
      next: () => {
        this.addedArtistIds.update((ids) => [...ids, artist.id]);
        this.isAddingArtist.set(false);
      },
      error: (err) => {
        this.artistError.set(this.t('events.addArtistError'));
        this.isAddingArtist.set(false);
        console.error('Error adding artist to event:', err);
      },
    });
  }

  removeArtistFromEvent(artistId: string): void {
    if (!this.currentEventId) return;

    this.artistError.set('');
    this.isRemovingArtist.set(true);

    this.eventsService.removeArtistFromEvent(this.currentEventId, artistId).subscribe({
      next: () => {
        this.addedArtistIds.update((ids) => ids.filter((id) => id !== artistId));
        this.isRemovingArtist.set(false);
        // Refresh event data to update UI
        this.refreshEvent();
      },
      error: (err) => {
        this.artistError.set(this.t('events.removeArtistError'));
        this.isRemovingArtist.set(false);
        console.error('Error removing artist from event:', err);
      },
    });
  }

  private refreshEvent(): void {
    if (!this.currentEventId) return;
    this.eventsService.getEventById(this.currentEventId).subscribe({
      next: (event) => {
        if (event) {
          this.addedArtistIds.set(event.artists?.map((a) => a.id) ?? []);
          // Force re-render by updating the observable
          this.event$ = of(event);
        }
      },
      error: (err) => {
        console.error('Error refreshing event:', err);
      },
    });
  }
}
