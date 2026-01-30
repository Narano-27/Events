import {Component, computed, input} from '@angular/core';
import {CommonModule} from '@angular/common';

interface ArtistPreview {
  id: string;
  label: string;
}

@Component({
  selector: 'app-artists-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (artistsCount() > 0) {
      <div class="artists">
        <p class="artists-count">
          {{ artistsCount() }} artist{{ artistsCount() > 1 ? 's' : '' }}
        </p>
        <ul class="artists-list">
          @for (artist of previewArtists(); track artist.id) {
            <li>{{ artist.label }}</li>
          }
          @if (artistsCount() > max()) {
            <li class="artists-more">+{{ artistsCount() - max() }} others</li>
          }
        </ul>
      </div>
    }
  `,
  styleUrls: ['./artists-preview.css'],
})
export class ArtistsPreview {
  artists = input<ArtistPreview[] | undefined>(undefined);
  max = input<number>(3);

  artistsCount = computed(() => this.artists()?.length ?? 0);
  previewArtists = computed(() => (this.artists() ?? []).slice(0, this.max()));
}
