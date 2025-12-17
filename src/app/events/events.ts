import { Component,input } from '@angular/core';
import { Event } from '../event';
@Component({
  selector: 'app-events',
  imports: [],
 template: `
    <section class="listing">

      <h2 class="listing-heading">{{ event().label }}</h2>
      <p class="listing-location">{{ event().startDate }}, {{ event().endDate }}</p>
    </section>
  `,
  styleUrls: ['./events.css'],
})

export class Events {
event = input.required<Event>();
}
