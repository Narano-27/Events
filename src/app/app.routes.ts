import {Routes} from '@angular/router';
import {Home} from './home/home';
import {EventsPage} from './events-page/events-page';
import {EventDetail} from './event-detail/event-detail';
import {EventForm} from './event-form/event-form';
import {EventEdit} from './event-edit/event-edit';
import {ArtistsPage} from './artists-page/artists-page';
import {ArtistDetail} from './artist-detail/artist-detail';
import {ArtistForm} from './artist-form/artist-form';
import {ArtistEdit} from './artist-edit/artist-edit';

export const appRoutes: Routes = [
  {path: '', component: Home},
  {path: 'events', component: EventsPage},
  {path: 'events/new', component: EventForm},
  {path: 'events/:id', component: EventDetail},
  {path: 'events/:id/edit', component: EventEdit},
  {path: 'artists', component: ArtistsPage},
  {path: 'artists/new', component: ArtistForm},
  {path: 'artists/:id', component: ArtistDetail},
  {path: 'artists/:id/edit', component: ArtistEdit},
  {path: '**', redirectTo: ''},
];
