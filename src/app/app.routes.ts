import {Routes} from '@angular/router';
import {Home} from './home/home';
import {EventsPage} from './events-page/events-page';
import {EventDetail} from './event-detail/event-detail';
import {EventForm} from './event-form/event-form';

export const appRoutes: Routes = [
  {path: '', component: Home},
  {path: 'events', component: EventsPage},
  {path: 'events/new', component: EventForm},
  {path: 'events/:id', component: EventDetail},
  {path: '**', redirectTo: ''},
];
