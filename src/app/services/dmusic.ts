import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private apiUrl = 'https://soundmatch-api-c0tq.onrender.com';

  constructor(private http: HttpClient) {}

  searchMusic(query: string) {
    const url = `${this.apiUrl}/music/search`;

    return this.http.get<any>(url, {
      params: {
        q: query
      }
    }).pipe(
      timeout(10000)
    );
  }

  getAlbum(albumId: number) {
    const url = `${this.apiUrl}/music/album/${albumId}`;

    return this.http.get<any>(url).pipe(
      timeout(10000)
    );
  }

  searchByGenreText(genreName: string) {
    const url = `${this.apiUrl}/music/genre/search`;

    return this.http.get<any>(url, {
      params: {
        q: genreName
      }
    }).pipe(
      timeout(10000)
    );
  }

  getGenreArtists(genreId: number) {
    const url = `${this.apiUrl}/music/genre/${genreId}/artists`;

    return this.http.get<any>(url).pipe(
      timeout(10000)
    );
  }

  getGenreTracks(genreId: number) {
    const url = `${this.apiUrl}/music/genre/${genreId}/tracks`;

    return this.http.get<any>(url).pipe(
      timeout(10000)
    );
  }

  searchArtistTracks(artistName: string) {
    const url = `${this.apiUrl}/music/artist/tracks`;

    return this.http.get<any>(url, {
      params: {
        name: artistName
      }
    }).pipe(
      timeout(10000)
    );
  }
}
