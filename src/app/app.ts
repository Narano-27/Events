import {Component} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <main>
      <header class="brand-name">
        <div class="logo-wrap">
          <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true" />
          <span class="brand-text">Evently</span>
        </div>
        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/events" routerLinkActive="active">Events</a>
        </nav>
      </header>
      <section class="content">
        <router-outlet />
      </section>
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {}