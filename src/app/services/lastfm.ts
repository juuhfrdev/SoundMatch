import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastfmService {
  private apiKey = 'de21a4cf72c8a34cc373644f7c70e9b9';
  private apiUrl = 'https://ws.audioscrobbler.com/2.0/';

  constructor(private http: HttpClient) {}

  getSimilarTracks(track: string, artist: string): Observable<any> {
    return this.http.get(this.apiUrl, {
      params: {
        method: 'track.getSimilar',
        track: track,
        artist: artist,
        api_key: this.apiKey,
        format: 'json',
        autocorrect: '1',
        limit: '50'
      }
    });
  }
}