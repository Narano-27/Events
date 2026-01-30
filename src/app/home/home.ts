import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {LanguageService} from '../language.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="hero-content">
          <span class="badge">{{ t('home.welcome') }}</span>
          <h1 class="title">
            {{ t('home.title') }}
          </h1>
          <p class="subtitle">{{ t('home.subtitle') }}</p>
          <p class="description">{{ t('home.description') }}</p>
          
          <div class="cta-buttons">
            <a routerLink="/events" class="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7 3V6M13 3V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M3 9H17" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              {{ t('nav.events') }}
            </a>
            <a routerLink="/artists" class="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 5V15L10 13L14 5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="10" cy="15" r="2" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="14" cy="13" r="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 8L14 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ t('nav.artists') }}
            </a>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="floating-card card-1">
            <div class="card-icon calendar">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="7" width="22" height="20" rx="3" stroke="white" stroke-width="2"/>
                <path d="M10 4V9M22 4V9" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M5 13H27" stroke="white" stroke-width="2"/>
                <circle cx="11" cy="18" r="1.5" fill="white"/>
                <circle cx="16" cy="18" r="1.5" fill="white"/>
                <circle cx="21" cy="18" r="1.5" fill="white"/>
              </svg>
            </div>
          </div>
          
          <div class="floating-card card-2">
            <div class="card-icon music">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6V22L14 20V18L22 6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="14" cy="24" r="3" stroke="white" stroke-width="2"/>
                <circle cx="22" cy="22" r="3" stroke="white" stroke-width="2"/>
                <path d="M14 12L22 10" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          
          <div class="floating-card card-3">
            <div class="card-icon link">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 19L19 13" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M15 10H12C9.79086 10 8 11.7909 8 14V14C8 16.2091 9.79086 18 12 18H13" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M17 22H20C22.2091 22 24 20.2091 24 18V18C24 15.7909 22.2091 14 20 14H19" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      <section class="features">
        <div class="feature">
          <div class="feature-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="7" y="10" width="26" height="23" rx="3" stroke="#605DC8" stroke-width="2.5"/>
              <path d="M14 6V12M26 6V12" stroke="#605DC8" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M7 17H33" stroke="#605DC8" stroke-width="2.5"/>
            </svg>
          </div>
          <h3>{{ t('home.eventManagement') }}</h3>
          <p>{{ t('home.eventManagementDesc') }}</p>
        </div>
        
        <div class="feature">
          <div class="feature-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27 8V28L17 25V23L27 8Z" stroke="#8B89E6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="17" cy="30" r="4" stroke="#8B89E6" stroke-width="2.5"/>
              <circle cx="27" cy="28" r="4" stroke="#8B89E6" stroke-width="2.5"/>
            </svg>
          </div>
          <h3>{{ t('home.artistTracking') }}</h3>
          <p>{{ t('home.artistTrackingDesc') }}</p>
        </div>
        
        <div class="feature">
          <div class="feature-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 24L23 18" stroke="#FF6B9D" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M19 15H15C12.2386 15 10 17.2386 10 20V20C10 22.7614 12.2386 25 15 25H17" stroke="#FF6B9D" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M21 30H25C27.7614 30 30 27.7614 30 25V25C30 22.2386 27.7614 20 25 20H23" stroke="#FF6B9D" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <h3>{{ t('home.flexibleAssociations') }}</h3>
          <p>{{ t('home.flexibleAssociationsDesc') }}</p>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.css'],
})
export class Home {
  constructor(private languageService: LanguageService) {}

  t(key: string): string {
    return this.languageService.t(key);
  }

  getCurrentLanguage() {
    return this.languageService.getCurrentLanguage();
  }
}