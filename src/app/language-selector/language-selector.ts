import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-selector">
      <button class="lang-button" (click)="toggleMenu()">
        <span class="flag">{{ currentFlag }}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      @if (isOpen()) {
        <div class="dropdown">
          @for (lang of languages; track lang.code) {
            <button 
              class="lang-option"
              [class.active]="lang.code === currentLang"
              (click)="selectLanguage(lang.code)">
              <span class="flag">{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styleUrls: ['./language-selector.css']
})
export class LanguageSelector {
  isOpen = signal(false);
  languages = this.languageService.languages;
  currentLang = '';
  currentFlag = '';

  constructor(private languageService: LanguageService) {
    this.updateCurrent();
  }

  toggleMenu() {
    this.isOpen.update(val => !val);
  }

  selectLanguage(code: 'fr' | 'en') {
    this.languageService.setLanguage(code);
    this.updateCurrent();
    this.isOpen.set(false);
  }

  private updateCurrent() {
    this.currentLang = this.languageService.getCurrentLanguage();
    const lang = this.languages.find(l => l.code === this.currentLang);
    this.currentFlag = lang?.flag || '🇫🇷';
  }
}
