import {Routes} from '@angular/router';
import {Home} from './home/home';
import {EventsPage} from './events-page/events-page';

export const appRoutes: Routes = [
  {path: '', component: Home},
  {path: 'events', component: EventsPage},
  {path: '**', redirectTo: ''},
];
