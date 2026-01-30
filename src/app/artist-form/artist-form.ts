import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {EventsService} from '../events.service';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/artists">← Back to artists</a>
    
    <section class="form-container">
      <h1>Add Artist</h1>
      
      <form (ngSubmit)="onSubmit()" #artistForm="ngForm">
        <div class="form-group">
          <label for="label">Artist Name *</label>
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
          {{ isSubmitting() ? 'Creating...' : 'Create Artist' }}
        </button>
      </form>

      @if (createdArtistId()) {
        <div class="success-section">
          <p>Artist created successfully!</p>
          <a [routerLink]="['/artists', createdArtistId()]" class="view-link">
            View Artist Profile →
          </a>
        </div>
      }
    </section>
  `,
  styleUrls: ['./artist-form.css'],
})
export class ArtistForm {
  private eventsService = inject(EventsService);
  private router = inject(Router);

  formData = {
    label: '',
  };

  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  createdArtistId = signal<string | null>(null);

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    this.eventsService.createArtist(this.formData).subscribe({
      next: (artist) => {
        this.successMessage.set('Artist created successfully!');
        this.createdArtistId.set(artist.id);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to create artist. Please try again.');
        this.isSubmitting.set(false);
        console.error('Error creating artist:', err);
      },
    });
  }
}
