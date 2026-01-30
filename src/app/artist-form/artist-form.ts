import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {EventsService} from '../events.service';
import {Event} from '../event';
import {LanguageService} from '../language.service';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/artists">{{ t('artists.backToArtists') }}</a>
    
    <section class="form-container">
      <h1>{{ t('artists.newArtist') }}</h1>
      
      <form (ngSubmit)="onSubmit()" #artistForm="ngForm">
        <div class="form-group">
          <label for="label">{{ t('artists.artistName') }} *</label>
          <input
            type="text"
            id="label"
            name="label"
            [(ngModel)]="formData.label"
            required
            placeholder="e.g., Clayton, The Weeknd..."
          />
        </div>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        @if (successMessage()) {
          <div class="success-message">{{ successMessage() }}</div>
        }

        <button type="submit" [disabled]="!artistForm.form.valid || isSubmitting()">
          {{ isSubmitting() ? t('artists.creating') : t('artists.create') }}
        </button>
      </form>

     
  `,
  styleUrls: ['./artist-form.css'],
})
export class ArtistForm {
  private eventsService = inject(EventsService);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  t(key: string): string {
    return this.languageService.t(key);
  }

  formData = {
    label: '',
  };

  eventSearchTerm = '';
  eventSearchResults = signal<Event[]>([]);
  isSearching = signal(false);
  isSubmitting = signal(false);
  isAddingEvent = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  eventError = signal('');
  createdArtistId = signal<string | null>(null);
  addedEvents = signal<Event[]>([]);
  addedEventIds = signal<string[]>([]);

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    
    // Validate name length
    if (this.formData.label.trim().length < 3) {
      this.errorMessage.set(this.t('artists.nameMinLength'));
      return;
    }
    
    this.isSubmitting.set(true);

    this.eventsService.createArtist(this.formData).subscribe({
      next: (artist) => {
        this.successMessage.set(this.t('artists.createSuccess'));
        this.createdArtistId.set(artist.id);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(this.t('artists.createError'));
        this.isSubmitting.set(false);
        console.error('Error creating artist:', err);
      },
    });
  }

  onSearchEvent(): void {
    const term = this.eventSearchTerm.trim();
    if (term.length === 0) {
      this.eventSearchResults.set([]);
      return;
    }

    this.isSearching.set(true);
    this.eventsService.searchEventsByName(term).subscribe({
      next: (events) => {
        this.eventSearchResults.set(events);
        this.isSearching.set(false);
      },
      error: (err) => {
        console.error('Error searching events:', err);
        this.isSearching.set(false);
      },
    });
  }

  addEventToArtist(event: Event): void {
    const artistId = this.createdArtistId();
    if (!artistId) return;

    this.eventError.set('');
    this.isAddingEvent.set(true);

    this.eventsService.addEventToArtist(artistId, event.id).subscribe({
      next: () => {
        this.addedEvents.update((events) => [...events, event]);
        this.addedEventIds.update((ids) => [...ids, event.id]);
        this.isAddingEvent.set(false);
      },
      error: (err) => {
        this.eventError.set(this.t('artists.addEventError'));
        this.isAddingEvent.set(false);
        console.error('Error adding event to artist:', err);
      },
    });
  }
}
