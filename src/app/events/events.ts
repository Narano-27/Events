import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Event} from '../event';
import {ArtistsPreview} from '../artists-preview/artists-preview';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [RouterLink, ArtistsPreview],
  template: `
    <section class="listing">

      <h2 class="listing-heading">
        <a class="listing-link" [routerLink]="['/events', event().id]">{{ event().label }}</a>
      </h2>
      <p class="listing-location">{{ event().startDate }}, {{ event().endDate }}</p>
      <app-artists-preview [artists]="event().artists" />
      <div class="listing-actions">
        <a [routerLink]="['/events', event().id]">View details</a>
      </div>
    </section>
  `,
  styleUrls: ['./events.css'],
})

export class Events {
event = input.required<Event>();
}
