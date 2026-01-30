import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Event} from './event';
import {Artist} from './artist';

@Injectable({
  providedIn: 'root',
})

export class EventsService {
  private readonly apiBase = 'http://localhost:8080';
  private readonly http = inject(HttpClient);

  getAllEvents(page = 0, size = 20, sort = 'label,asc'): Observable<Event[]> {
    return this.getEventsPage(page, size, sort).pipe(map((res) => res.content ?? []));
  }

  getEventsPage(page = 0, size = 20, sort = 'label,asc'): Observable<EventPage> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http
      .get<EventPage>(`${this.apiBase}/events`, {params})
      .pipe(map((res) => ({...res, content: res.content ?? []})));
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiBase}/events/${id}`);
  }

  createEvent(event: Omit<Event, 'id' | 'artists'>): Observable<Event> {
    return this.http.post<Event>(`${this.apiBase}/events`, event);
  }

  getAllArtists(page = 0, size = 100, sort = 'label,asc'): Observable<Artist[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http
      .get<ArtistPage>(`${this.apiBase}/artists`, {params})
      .pipe(map((res) => res.content ?? []));
  }

  searchArtistsByName(name: string): Observable<Artist[]> {
    return this.getAllArtists(0, 100).pipe(
      map((artists) => artists.filter((a) => a.label.toLowerCase().includes(name.toLowerCase())))
    );
  }

  addArtistToEvent(eventId: string, artistId: string): Observable<Event> {
    return this.http.post<Event>(`${this.apiBase}/events/${eventId}/artists/${artistId}`, {});
  }

  removeArtistFromEvent(eventId: string, artistId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/events/${eventId}/artists/${artistId}`);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/events/${id}`);
  }

  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiBase}/events/${id}`, event);
  }
}

export interface EventPage {
  content?: Event[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
}

interface ArtistPage {
  content?: Artist[];
  totalElements?: number;
  totalPages?: number;
}