import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {EventsService} from '../events.service';
import {Artist} from '../artist';
import {LanguageService} from '../language.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/events">{{ t('events.backToEvents') }}</a>
    
    <section class="form-container">
      <h1>{{ t('events.newEvent') }}</h1>
      
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

        <button type="submit" [disabled]="!eventForm.form.valid || isSubmitting()">
          {{ isSubmitting() ? t('events.creating') : t('events.create') }}
        </button>
      </form>

      @if (createdEventId()) {
        <section class="artist-section">
          <h2>{{ t('events.addArtists') }}</h2>
          <p class="info">{{ t('events.addArtistsInfo') }}</p>

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

          @if (addedArtists().length > 0) {
            <div class="added-artists">
              <h3>{{ t('events.addedArtists') }} ({{ addedArtists().length }})</h3>
              <ul>
                @for (artist of addedArtists(); track artist.id) {
                  <li>{{ artist.label }}</li>
                }
              </ul>
            </div>
          }

          @if (artistError()) {
            <div class="error-message">{{ artistError() }}</div>
          }

          <a [routerLink]="['/events', createdEventId()]" class="view-event-link">
            {{ t('events.viewEventDetails') }}
          </a>
        </section>
      }
    </section>
  `,
  styleUrls: ['./event-form.css'],
})
export class EventForm {
  private eventsService = inject(EventsService);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  t(key: string): string {
    return this.languageService.t(key);
  }

  getCurrentLanguage() {
    return this.languageService.getCurrentLanguage();
  }

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
  errorMessage = signal('');
  successMessage = signal('');
  artistError = signal('');
  createdEventId = signal<string | null>(null);
  addedArtists = signal<Artist[]>([]);
  addedArtistIds = signal<string[]>([]);

  onSubmit(): void {
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

    this.eventsService.createEvent(this.formData).subscribe({
      next: (event) => {
        this.successMessage.set(this.t('events.createSuccess'));
        this.createdEventId.set(event.id);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(this.t('events.createError'));
        this.isSubmitting.set(false);
        console.error('Error creating event:', err);
      },
    });
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
    const eventId = this.createdEventId();
    if (!eventId) return;

    this.artistError.set('');
    this.isAddingArtist.set(true);

    this.eventsService.addArtistToEvent(eventId, artist.id).subscribe({
      next: () => {
        this.addedArtists.update((artists) => [...artists, artist]);
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
}
