import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Event} from './event';

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