import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  constructor(private http: HttpClient) {}

  searchMusic(query: string) {
    const url = `https://corsproxy.io/?https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
    console.log('URL DA REQUISIÇÃO:', url);

    return this.http.get<any>(url).pipe(
      timeout(10000)
    );
  }
}