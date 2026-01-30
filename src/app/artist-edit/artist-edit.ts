import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {EventsService} from '../events.service';
import {Artist} from '../artist';
import {signal} from '@angular/core';

@Component({
  selector: 'app-artist-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <a class="back-link" routerLink="/artists">← Back to artists</a>

    @if (artist$ | async; as artist) {
      <section class="form-container">
        <h1>Edit Artist</h1>

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

          <div class="form-actions">
            <button type="submit" [disabled]="!artistForm.form.valid || isSubmitting()">
              {{ isSubmitting() ? 'Saving...' : 'Save Changes' }}
            </button>
            <button type="button" class="btn-danger" (click)="onDelete()">
              Delete Artist
            </button>
          </div>
        </form>
      </section>
    } @else {
      <div class="empty">Artist not found.</div>
    }
  `,
  styleUrls: ['./artist-edit.css'],
})
export class ArtistEdit {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  artist$: Observable<Artist | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.eventsService.getArtistById(id) : of(null);
    }),
  );

  formData = {
    label: '',
  };

  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  currentArtistId: string | null = null;

  constructor() {
    this.artist$.subscribe((artist) => {
      if (artist) {
        this.currentArtistId = artist.id;
        this.formData = {
          label: artist.label,
        };
      }
    });
  }

  onSubmit(): void {
    if (!this.currentArtistId) return;
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    this.eventsService.updateArtist(this.currentArtistId, this.formData).subscribe({
      next: () => {
        this.successMessage.set('Artist updated successfully!');
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to update artist. Please try again.');
        this.isSubmitting.set(false);
        console.error('Error updating artist:', err);
      },
    });
  }

  onDelete(): void {
    if (!this.currentArtistId) return;
    if (confirm(`Are you sure you want to delete "${this.formData.label}"?`)) {
      this.eventsService.deleteArtist(this.currentArtistId).subscribe({
        next: () => {
          this.router.navigate(['/artists']);
        },
        error: (err) => {
          this.errorMessage.set('Failed to delete artist. Please try again.');
          console.error('Error deleting artist:', err);
        },
      });
    }
  }
}
