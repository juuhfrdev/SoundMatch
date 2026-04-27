import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  constructor(private http: HttpClient) {}

  private proxyUrl = 'https://corsproxy.io/?';

  searchMusic(query: string) {
    const url = `${this.proxyUrl}https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
    return this.http.get<any>(url).pipe(timeout(10000));
  }

  getAlbum(albumId: number) {
    const url = `${this.proxyUrl}https://api.deezer.com/album/${albumId}`;
    return this.http.get<any>(url).pipe(timeout(10000));
  }

  searchByGenreText(genreName: string) {
    const url = `${this.proxyUrl}https://api.deezer.com/search?q=${encodeURIComponent(genreName)}`;
    return this.http.get<any>(url).pipe(timeout(10000));
  }

  getGenreArtists(genreId: number) {
    const url = `${this.proxyUrl}https://api.deezer.com/genre/${genreId}/artists`;
   return this.http.get<any>(url).pipe(timeout(10000));
}

  getGenreTracks(genreId: number) {
    const url = `${this.proxyUrl}https://api.deezer.com/chart/${genreId}/tracks`;
    return this.http.get<any>(url).pipe(timeout(10000));
}

  searchArtistTracks(artistName: string) {
    const url = `${this.proxyUrl}https://api.deezer.com/search?q=${encodeURIComponent(`artist:"${artistName}"`)}`;
    return this.http.get<any>(url).pipe(timeout(10000));
}
}