import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {EventsService} from '../events.service';
import {Artist} from '../artist';
import {Event} from '../event';
import {signal} from '@angular/core';
import {LanguageService} from '../language.service';

@Component({
  selector: 'app-artist-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/artists">{{ t('artists.backToArtists') }}</a>

    @if (artist$ | async; as artist) {
      <section class="form-container">
        <h1>{{ t('artists.edit') }} {{ t('artists.title') }}</h1>

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

          <div class="form-actions">
            <button type="submit" [disabled]="!artistForm.form.valid || isSubmitting()">
              {{ isSubmitting() ? t('artists.saving') : t('artists.saveChanges') }}
            </button>
            <button type="button" class="btn-danger" (click)="onDelete()">
              {{ t('artists.delete') }}
            </button>
          </div>
        </form>

        
      </section>
    } @else {
      <div class="empty">{{ t('artists.artistNotFound') }}</div>
    }
  `,
  styleUrls: ['./artist-edit.css'],
})
export class ArtistEdit {
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

  formData = {
    label: '',
  };

  eventSearchTerm = '';
  eventSearchResults = signal<Event[]>([]);
  isSearching = signal(false);
  isSubmitting = signal(false);
  isAddingEvent = signal(false);
  isRemovingEvent = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  eventError = signal('');
  addedEventIds = signal<string[]>([]);
  currentArtistId: string | null = null;

  constructor() {
    this.artist$.subscribe((artist) => {
      if (artist) {
        this.currentArtistId = artist.id;
        this.formData = {
          label: artist.label,
        };
        this.addedEventIds.set(artist.events?.map((e) => e.id) ?? []);
      }
    });
  }

  onSubmit(): void {
    if (!this.currentArtistId) return;
    this.errorMessage.set('');
    this.successMessage.set('');
    
    // Validate name length
    if (this.formData.label.trim().length < 3) {
      this.errorMessage.set(this.t('artists.nameMinLength'));
      return;
    }
    
    this.isSubmitting.set(true);

    this.eventsService.updateArtist(this.currentArtistId, this.formData).subscribe({
      next: () => {
        this.successMessage.set(this.t('artists.updateSuccess'));
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(this.t('artists.updateError'));
        this.isSubmitting.set(false);
        console.error('Error updating artist:', err);
      },
    });
  }

  onDelete(): void {
    if (!this.currentArtistId) return;
    if (confirm(`${this.t('artists.deleteConfirm')} "${this.formData.label}"?`)) {
      this.eventsService.deleteArtist(this.currentArtistId).subscribe({
        next: () => {
          this.router.navigate(['/artists']);
        },
        error: (err) => {
          this.errorMessage.set(this.t('artists.deleteError'));
          console.error('Error deleting artist:', err);
        },
      });
    }
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
    if (!this.currentArtistId) return;

    this.eventError.set('');
    this.isAddingEvent.set(true);

    this.eventsService.addEventToArtist(this.currentArtistId, event.id).subscribe({
      next: () => {
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

  removeEventFromArtist(eventId: string): void {
    if (!this.currentArtistId) return;

    this.eventError.set('');
    this.isRemovingEvent.set(true);

    this.eventsService.removeEventFromArtist(this.currentArtistId, eventId).subscribe({
      next: () => {
        this.addedEventIds.update((ids) => ids.filter((id) => id !== eventId));
        this.isRemovingEvent.set(false);
      },
      error: (err) => {
        this.eventError.set(this.t('artists.removeEventError'));
        this.isRemovingEvent.set(false);
        console.error('Error removing event from artist:', err);
      },
    });
  }
}
