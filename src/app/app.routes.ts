import {Routes} from '@angular/router';
import {Home} from './home/home';
import {EventsPage} from './events-page/events-page';
import {EventDetail} from './event-detail/event-detail';

export const appRoutes: Routes = [
  {path: '', component: Home},
  {path: 'events', component: EventsPage},
  {path: 'events/:id', component: EventDetail},
  {path: '**', redirectTo: ''},
];
