import {Component, computed, input, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LanguageService} from '../language.service';

interface ArtistPreview {
  id: string;
  label: string;
}

@Component({
  selector: 'app-artists-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="artists">
      <p class="artists-count">
        {{ artistsCount() }} {{ t('events.artists').toLowerCase() }}{{ artistsCount() > 1 ? 's' : '' }}
      </p>
      @if (artistsCount() > 0) {
        <ul class="artists-list">
          @for (artist of previewArtists(); track artist.id) {
            <li>{{ artist.label }}</li>
          }
          @if (artistsCount() > max()) {
            <li class="artists-more">+{{ artistsCount() - max() }} {{ getCurrentLanguage() === 'fr' ? 'autres' : 'others' }}</li>
          }
        </ul>
      } @else {
        <p class="artists-none">{{ t('events.noArtists') }}</p>
      }
    </div>
  `,
  styleUrls: ['./artists-preview.css'],
})
export class ArtistsPreview {
  artists = input<ArtistPreview[] | undefined>(undefined);
  max = input<number>(3);
  private languageService = inject(LanguageService);

  artistsCount = computed(() => this.artists()?.length ?? 0);
  previewArtists = computed(() => (this.artists() ?? []).slice(0, this.max()));

  t(key: string): string {
    return this.languageService.t(key);
  }

  getCurrentLanguage() {
    return this.languageService.getCurrentLanguage();
  }
}
