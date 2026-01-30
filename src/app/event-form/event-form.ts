import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {EventsService} from '../events.service';
import {Artist} from '../artist';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/events">← Back to events</a>
    
    <section class="form-container">
      <h1>Create Event</h1>
      
      <form (ngSubmit)="onSubmit()" #eventForm="ngForm">
        <div class="form-group">
          <label for="label">Event Name *</label>
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
            <label for="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              [(ngModel)]="formData.startDate"
              required
            />
          </div>

          <div class="form-group">
            <label for="endDate">End Date *</label>
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
          {{ isSubmitting() ? 'Creating...' : 'Create Event' }}
        </button>
      </form>

      @if (createdEventId()) {
        <section class="artist-section">
          <h2>Add Artists</h2>
          <p class="info">Search and add artists to this event</p>

          <div class="search-container">
            <input
              type="text"
              [(ngModel)]="artistSearchTerm"
              (input)="onSearchArtist()"
              placeholder="Search artist by name..."
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
                    {{ addedArtistIds().includes(artist.id) ? '✓ Added' : 'Add' }}
                  </button>
                </li>
              }
            </ul>
          }

          @if (artistSearchTerm.length > 0 && artistSearchResults().length === 0 && !isSearching()) {
            <div class="no-results">No artists found with that name</div>
          }

          @if (addedArtists().length > 0) {
            <div class="added-artists">
              <h3>Added Artists ({{ addedArtists().length }})</h3>
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
            View Event Details →
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
    this.isSubmitting.set(true);

    this.eventsService.createEvent(this.formData).subscribe({
      next: (event) => {
        this.successMessage.set('Event created successfully! Now you can add artists.');
        this.createdEventId.set(event.id);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to create event. Please try again.');
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
        this.artistError.set(`Failed to add artist "${artist.label}". Please try again.`);
        this.isAddingArtist.set(false);
        console.error('Error adding artist to event:', err);
      },
    });
  }
}
