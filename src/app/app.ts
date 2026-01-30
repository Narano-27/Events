import {Component, signal, effect} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {LanguageSelector} from './language-selector/language-selector';
import {LanguageService} from './language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LanguageSelector],
  template: `
    <main>
      <header>
        <div class="header-left">
          <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true" />
          <nav class="nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">{{ t('nav.home') }}</a>
            <a routerLink="/events" routerLinkActive="active">{{ t('nav.events') }}</a>
            <a routerLink="/artists" routerLinkActive="active">{{ t('nav.artists') }}</a>
          </nav>
        </div>
        <div class="header-right">
          <app-language-selector />
        </div>
      </header>
      <section class="content">
        <router-outlet />
      </section>
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  translations = signal(this.languageService.getTranslations());

  constructor(private languageService: LanguageService) {
    effect(() => {
      this.translations.set(this.languageService.getTranslations());
    });
  }

  t(key: string): string {
    return this.languageService.t(key);
  }
}